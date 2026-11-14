import { beforeEach, describe, expect, it } from 'vitest'
import { COFFEE_FLASH_OFFER_ID } from '../../data/offers'
import { useOffersStore } from '../offers/offersStore'
import { usePointsStore } from '../points/pointsStore'
import { useAccountStore } from './accountStore'
import { useSessionStore } from './sessionStore'

const account = () => useAccountStore.getState()

beforeEach(() => {
  account().restoreDemoData()
})

describe('login e logout', () => {
  it('entra como um usuário de exemplo e sai', () => {
    expect(account().login('user-ana')).toBe(true)
    expect(useSessionStore.getState().currentUserId).toBe('user-ana')
    account().logout()
    expect(useSessionStore.getState().currentUserId).toBeNull()
  })

  it('recusa usuário inexistente sem alterar a sessão', () => {
    expect(account().login('ninguem')).toBe(false)
    expect(useSessionStore.getState().currentUserId).toBeNull()
  })
})

describe('restoreDemoData', () => {
  it('volta todos os stores aos dados iniciais e encerra a sessão', () => {
    account().login('user-ana')
    useOffersStore.getState().claimCoupon('user-ana', COFFEE_FLASH_OFFER_ID)
    usePointsStore.getState().generatePurchaseCode('user-ana')
    expect(usePointsStore.getState().coupons).toHaveLength(2)

    account().restoreDemoData()

    expect(usePointsStore.getState().coupons).toHaveLength(1)
    expect(usePointsStore.getState().purchaseCodes).toHaveLength(0)
    expect(useOffersStore.getState().offers.find((o) => o.id === COFFEE_FLASH_OFFER_ID)?.redeemedCount).toBe(
      1,
    )
    expect(useSessionStore.getState().currentUserId).toBeNull()
  })
})
