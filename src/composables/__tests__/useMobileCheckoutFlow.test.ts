import { describe, expect, it } from 'vitest'
import { buildMobileCheckoutFlow, resolveExpandedMobileSection } from '../useMobileCheckoutFlow'

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
