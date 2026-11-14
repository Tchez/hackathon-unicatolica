import { beforeEach, describe, expect, it } from 'vitest'
import { COFFEE_FLASH_OFFER_ID, GPU_OFFER_ID } from '../../data/offers'
import { useAccountStore } from '../account/accountStore'
import { usePointsStore } from '../points/pointsStore'
import { useOffersStore } from './offersStore'

const offers = () => useOffersStore.getState()
const find = (id: string) => offers().offers.find((o) => o.id === id)!

beforeEach(() => {
  useAccountStore.getState().restoreDemoData()
})

describe('claimCoupon', () => {
  it('resgata oferta liberada e gera cupom válido por 60 min', () => {
    const now = Date.now()
    const result = offers().claimCoupon('user-ana', COFFEE_FLASH_OFFER_ID, now)
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(Date.parse(result.value.expiresAt) - now).toBe(60 * 60_000)
    expect(find(COFFEE_FLASH_OFFER_ID).redeemedCount).toBe(2)
    expect(usePointsStore.getState().coupons).toContainEqual(result.value)
  })

  it('permite um cupom por pessoa por oferta', () => {
    expect(offers().claimCoupon('user-ana', COFFEE_FLASH_OFFER_ID).ok).toBe(true)
    const again = offers().claimCoupon('user-ana', COFFEE_FLASH_OFFER_ID)
    expect(again).toEqual({ ok: false, error: 'already_claimed' })
    // Bruno já tem o cupom inicial desta oferta.
    expect(offers().claimCoupon('user-bruno', COFFEE_FLASH_OFFER_ID)).toEqual({
      ok: false,
      error: 'already_claimed',
    })
  })

  it('recusa lote ainda não liberado', () => {
    expect(offers().claimCoupon('user-ana', GPU_OFFER_ID)).toEqual({ ok: false, error: 'upcoming' })
  })

  it('respeita a quantidade restante até esgotar', () => {
    offers().releaseBatch(GPU_OFFER_ID, 1)
    expect(offers().claimCoupon('user-ana', GPU_OFFER_ID).ok).toBe(true)
    expect(offers().claimCoupon('user-bruno', GPU_OFFER_ID)).toEqual({ ok: false, error: 'sold_out' })
    expect(find(GPU_OFFER_ID).redeemedCount).toBe(1)
  })

  it('recusa oferta encerrada e usuário que não é visitante', () => {
    const late = Date.parse(find(COFFEE_FLASH_OFFER_ID).endsAt) + 1
    expect(offers().claimCoupon('user-ana', COFFEE_FLASH_OFFER_ID, late)).toEqual({
      ok: false,
      error: 'ended',
    })
    expect(offers().claimCoupon('user-techplay', COFFEE_FLASH_OFFER_ID)).toEqual({
      ok: false,
      error: 'invalid_user',
    })
    expect(offers().claimCoupon('user-ana', 'nao-existe')).toEqual({ ok: false, error: 'offer_not_found' })
  })
})

describe('releaseBatch', () => {
  it('acrescenta um lote liberado na hora e a oferta passa a estar liberada', () => {
    const now = Date.now()
    const result = offers().releaseBatch(GPU_OFFER_ID, 5, now)
    expect(result.ok).toBe(true)
    expect(find(GPU_OFFER_ID).batches).toEqual([{ releaseAt: new Date(now).toISOString(), quantity: 5 }])
    expect(offers().getOfferStatus(find(GPU_OFFER_ID), now)).toBe('live')
    expect(offers().getRemaining(find(GPU_OFFER_ID), now)).toBe(5)
  })

  it('recusa quantidade inválida e oferta inexistente', () => {
    expect(offers().releaseBatch(GPU_OFFER_ID, 0)).toEqual({ ok: false, error: 'invalid_quantity' })
    expect(offers().releaseBatch('nao-existe', 5)).toEqual({ ok: false, error: 'offer_not_found' })
  })
})

describe('createFlashOffer', () => {
  const input = {
    storeId: 'store-cafe-ipe',
    title: ' Pão de queijo ',
    discountPercent: 20,
    durationMinutes: 10,
    quantity: 8,
  }

  it('publica oferta liberada, sem campanha, que encerra no prazo', () => {
    const now = Date.now()
    const result = offers().createFlashOffer(input, now)
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.value.title).toBe('Pão de queijo')
    expect(result.value.campaignId).toBeUndefined()
    expect(offers().getRemaining(result.value, now)).toBe(8)
    expect(offers().getOfferStatus(result.value, now + 10 * 60_000)).toBe('ended')
  })

  it('recusa loja inexistente e dados inválidos', () => {
    expect(offers().createFlashOffer({ ...input, storeId: 'x' })).toEqual({
      ok: false,
      error: 'store_not_found',
    })
    expect(offers().createFlashOffer({ ...input, discountPercent: 100 })).toEqual({
      ok: false,
      error: 'invalid_input',
    })
    expect(offers().createFlashOffer({ ...input, quantity: 0 })).toEqual({
      ok: false,
      error: 'invalid_input',
    })
  })
})

describe('closeOffer e markPresence', () => {
  it('encerra a oferta antes do prazo', () => {
    const now = Date.now()
    offers().closeOffer(COFFEE_FLASH_OFFER_ID, now)
    expect(offers().getOfferStatus(find(COFFEE_FLASH_OFFER_ID), now)).toBe('ended')
  })

  it('marca e desmarca presença', () => {
    offers().markPresence('user-ana', true)
    offers().markPresence('user-ana', true)
    expect(offers().presentUserIds).toEqual(['user-ana'])
    offers().markPresence('user-ana', false)
    expect(offers().presentUserIds).toEqual([])
  })
})
