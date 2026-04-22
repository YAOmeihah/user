import { describe, expect, it } from 'vitest'
import {
  buildMobileCheckoutFlow,
  isMobileBuyerReady,
  isMobileManualFormReady,
  isMobileShippingReady,
  resolveExpandedMobileSection,
} from '../useMobileCheckoutFlow'

describe('buildMobileCheckoutFlow', () => {
  it('starts on shipping when a shippable order has no address yet', () => {
    const result = buildMobileCheckoutFlow({
      hasShippingSection: true,
      shippingComplete: false,
      buyerComplete: false,
      paymentComplete: false,
    })

    expect(result.visibleSectionKeys).toEqual(['items', 'shipping', 'buyer', 'coupon', 'payment'])
    expect(result.recommendedSectionKey).toBe('shipping')
    expect(result.primaryActionKey).toBe('saveShipping')
  })

  it('skips shipping and moves straight to buyer info for digital-only orders', () => {
    const result = buildMobileCheckoutFlow({
      hasShippingSection: false,
      shippingComplete: true,
      buyerComplete: false,
      paymentComplete: false,
    })

    expect(result.visibleSectionKeys).toEqual(['items', 'buyer', 'coupon', 'payment'])
    expect(result.recommendedSectionKey).toBe('buyer')
    expect(result.primaryActionKey).toBe('continueBuyer')
  })

  it('switches the primary action to submit once required sections are complete', () => {
    const result = buildMobileCheckoutFlow({
      hasShippingSection: true,
      shippingComplete: true,
      buyerComplete: true,
      paymentComplete: true,
    })

    expect(result.recommendedSectionKey).toBe('payment')
    expect(result.primaryActionKey).toBe('submit')
  })
})

describe('resolveExpandedMobileSection', () => {
  it('keeps a user-opened later section expanded while earlier incomplete sections still exist', () => {
    const expanded = resolveExpandedMobileSection({
      expandedSectionKey: 'payment',
      recommendedSectionKey: 'shipping',
      completedSectionKeys: ['items'],
      visibleSectionKeys: ['items', 'shipping', 'buyer', 'coupon', 'payment'],
    })

    expect(expanded).toBe('payment')
  })

  it('auto-advances after the currently open section becomes complete', () => {
    const expanded = resolveExpandedMobileSection({
      expandedSectionKey: 'shipping',
      recommendedSectionKey: 'buyer',
      completedSectionKeys: ['items', 'shipping'],
      visibleSectionKeys: ['items', 'shipping', 'buyer', 'coupon', 'payment'],
    })

    expect(expanded).toBe('buyer')
  })
})

describe('mobile section readiness', () => {
  it('does not treat one-character shipping data as ready', () => {
    const ready = isMobileShippingReady({
      requiresShipping: true,
      receiverName: 'A',
      receiverPhone: '1',
      provinceCode: '110000',
      cityCode: '110100',
      districtCode: '110101',
      townshipCode: '110101001',
      detailAddress: '1',
    })

    expect(ready).toBe(false)
  })

  it('does not treat one-character manual text fields as ready', () => {
    const ready = isMobileManualFormReady(
      [
        {
          itemKey: '1',
          fields: [
            {
              key: 'qq',
              type: 'text',
              required: true,
              options: [],
            },
          ],
        },
      ],
      {
        '1': {
          qq: 'a',
        },
      },
    )

    expect(ready).toBe(false)
  })

  it('requires a meaningful guest password before buyer info is ready', () => {
    const ready = isMobileBuyerReady({
      isAuthenticated: false,
      checkoutMode: 'guest',
      manualFormsReady: true,
      guestPhone: '13800138000',
      guestPassword: '1',
      guestEmail: '',
      captchaComplete: true,
    })

    expect(ready).toBe(false)
  })
})
