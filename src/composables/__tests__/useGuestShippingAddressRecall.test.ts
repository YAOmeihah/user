import { describe, expect, it } from 'vitest'
import {
  GUEST_SHIPPING_ADDRESS_MAX_AGE_MS,
  loadGuestShippingAddressRecall,
} from '../useGuestShippingAddressRecall'

describe('loadGuestShippingAddressRecall', () => {
  it('returns null when the saved record is older than 30 days', () => {
    localStorage.setItem('guest_checkout_recent_shipping_address_v1', JSON.stringify({
      receiver_name: '张三',
      receiver_phone: '13800138000',
      province: '上海市',
      province_code: '310000',
      city: '上海市',
      city_code: '310100',
      district: '浦东新区',
      district_code: '310115',
      township: '花木街道',
      township_code: '310115013',
      detail_address: '世纪大道 100 号',
      saved_at: new Date(Date.now() - GUEST_SHIPPING_ADDRESS_MAX_AGE_MS - 1000).toISOString(),
    }))

    expect(loadGuestShippingAddressRecall()).toBeNull()
  })
})
