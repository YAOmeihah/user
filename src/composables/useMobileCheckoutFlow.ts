export type MobileCheckoutSectionKey = 'items' | 'shipping' | 'buyer' | 'coupon' | 'payment'
export type MobileCheckoutPrimaryActionKey = 'saveShipping' | 'continueBuyer' | 'choosePayment' | 'submit'

export interface MobileCheckoutFlowInput {
  hasShippingSection: boolean
  shippingComplete: boolean
  buyerComplete: boolean
  paymentComplete: boolean
}

export interface MobileCheckoutFlowState {
  visibleSectionKeys: MobileCheckoutSectionKey[]
  completedSectionKeys: MobileCheckoutSectionKey[]
  recommendedSectionKey: MobileCheckoutSectionKey
  primaryActionKey: MobileCheckoutPrimaryActionKey
}

export interface ResolveExpandedMobileSectionInput {
  expandedSectionKey: MobileCheckoutSectionKey | null
  recommendedSectionKey: MobileCheckoutSectionKey
  completedSectionKeys: MobileCheckoutSectionKey[]
  visibleSectionKeys: MobileCheckoutSectionKey[]
}

const sectionIsComplete = (
  sectionKey: MobileCheckoutSectionKey,
  input: MobileCheckoutFlowInput,
) => {
  if (sectionKey === 'items') return true
  if (sectionKey === 'shipping') return input.shippingComplete
  if (sectionKey === 'buyer') return input.buyerComplete
  if (sectionKey === 'coupon') return false

  return input.paymentComplete
}

export const buildMobileCheckoutFlow = (
  input: MobileCheckoutFlowInput,
): MobileCheckoutFlowState => {
  const visibleSectionKeys: MobileCheckoutSectionKey[] = input.hasShippingSection
    ? ['items', 'shipping', 'buyer', 'coupon', 'payment']
    : ['items', 'buyer', 'coupon', 'payment']

  const completedSectionKeys = visibleSectionKeys.filter((sectionKey) =>
    sectionIsComplete(sectionKey, input),
  )

  const recommendedSectionKey =
    visibleSectionKeys.find((sectionKey) => {
      if (sectionKey === 'coupon' || sectionKey === 'items') return false

      return !completedSectionKeys.includes(sectionKey)
    }) ?? 'payment'

  let primaryActionKey: MobileCheckoutPrimaryActionKey = 'submit'

  if (recommendedSectionKey === 'shipping') {
    primaryActionKey = 'saveShipping'
  } else if (recommendedSectionKey === 'buyer') {
    primaryActionKey = 'continueBuyer'
  } else if (recommendedSectionKey === 'payment' && !input.paymentComplete) {
    primaryActionKey = 'choosePayment'
  }

  return {
    visibleSectionKeys,
    completedSectionKeys,
    recommendedSectionKey,
    primaryActionKey,
  }
}

export const resolveExpandedMobileSection = ({
  expandedSectionKey,
  recommendedSectionKey,
  completedSectionKeys,
  visibleSectionKeys,
}: ResolveExpandedMobileSectionInput) => {
  if (!expandedSectionKey) {
    return recommendedSectionKey
  }

  if (!visibleSectionKeys.includes(expandedSectionKey)) {
    return recommendedSectionKey
  }

  if (!completedSectionKeys.includes(expandedSectionKey)) {
    return expandedSectionKey
  }

  if (expandedSectionKey === recommendedSectionKey) {
    return recommendedSectionKey
  }

  return recommendedSectionKey
}
