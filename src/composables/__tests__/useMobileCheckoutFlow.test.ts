import { describe, expect, it } from 'vitest'
import { buildMobileCheckoutFlow } from '../useMobileCheckoutFlow'

describe('buildMobileCheckoutFlow', () => {
  it('starts on shipping when a shippable order has no address yet', () => {
    const result = buildMobileCheckoutFlow({
      hasShippingSection: true,
      shippingComplete: false,
      buyerComplete: false,
      paymentComplete: false,
    })

    expect(result.recommendedSectionKey).toBe('shipping')
    expect(result.primaryActionKey).toBe('saveShipping')
  })
})
