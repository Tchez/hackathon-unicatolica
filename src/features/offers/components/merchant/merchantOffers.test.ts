import { beforeEach, describe, expect, it } from 'vitest'
import { COFFEE_FLASH_OFFER_ID, TV_OFFER_ID, HEADPHONE_FLASH_OFFER_ID } from '../../../../data/offers'
import { getOfferStatus, getRemaining } from '../../../../lib/offers'
import { useAccountStore } from '../../../account/accountStore'
import { useOffersStore } from '../../offersStore'
import { getMerchantOffers } from './merchantOffers'

const offers = () => useOffersStore.getState()

beforeEach(() => {
  useAccountStore.getState().restoreDemoData()
})

describe('getMerchantOffers', () => {
  it('lista só as ofertas da loja, com as em andamento antes das em breve', () => {
    const list = getMerchantOffers(offers().offers, 'store-techplay', Date.now())
    expect(list.map((item) => item.offer.id)).toEqual([HEADPHONE_FLASH_OFFER_ID, TV_OFFER_ID])
    expect(list.map((item) => item.status)).toEqual(['live', 'upcoming'])
  })

  it('não mostra ofertas de outras lojas', () => {
    const list = getMerchantOffers(offers().offers, 'store-cafe-ipe', Date.now())
    expect(list.map((item) => item.offer.id)).toEqual([COFFEE_FLASH_OFFER_ID])
  })

  it('põe a oferta publicada agora no topo e as encerradas no fim', () => {
    const now = Date.now()
    const created = offers().createFlashOffer(
      { storeId: 'store-techplay', title: 'Teclado', discountPercent: 20, durationMinutes: 10, quantity: 3 },
      now,
    )
    if (!created.ok) throw new Error('oferta não criada')
    offers().closeOffer(HEADPHONE_FLASH_OFFER_ID, now)

    const list = getMerchantOffers(offers().offers, 'store-techplay', now + 1000)
    expect(list.map((item) => [item.offer.id, item.status])).toEqual([
      [created.value.id, 'live'],
      [TV_OFFER_ID, 'upcoming'],
      [HEADPHONE_FLASH_OFFER_ID, 'ended'],
    ])
  })
})

describe('J7: ciclo da oferta relâmpago do lojista', () => {
  const input = {
    storeId: 'store-techplay',
    title: 'Mouse gamer',
    discountPercent: 30,
    durationMinutes: 1,
    quantity: 1,
  }

  it('nasce liberada, esgota ao resgatar a última unidade e encerra ao expirar', () => {
    const now = Date.now()
    const created = offers().createFlashOffer(input, now)
    if (!created.ok) throw new Error('oferta não criada')
    const offer = () => offers().offers.find((item) => item.id === created.value.id)!

    expect(getOfferStatus(offer(), now)).toBe('live')
    expect(getRemaining(offer(), now)).toBe(1)

    expect(offers().claimCoupon('user-ana', offer().id, now).ok).toBe(true)
    expect(getRemaining(offer(), now)).toBe(0)
    expect(getOfferStatus(offer(), now)).toBe('sold_out')

    const second = offers().createFlashOffer({ ...input, quantity: 5 }, now)
    if (!second.ok) throw new Error('oferta não criada')
    const secondOffer = () => offers().offers.find((item) => item.id === second.value.id)!
    expect(getOfferStatus(secondOffer(), now + 59_000)).toBe('live')
    expect(getOfferStatus(secondOffer(), now + 60_000)).toBe('ended')
  })

  it('encerrar agora muda o estado para encerrada', () => {
    const now = Date.now()
    const created = offers().createFlashOffer({ ...input, durationMinutes: 60 }, now)
    if (!created.ok) throw new Error('oferta não criada')
    expect(offers().closeOffer(created.value.id, now + 1000).ok).toBe(true)
    const closed = offers().offers.find((item) => item.id === created.value.id)!
    expect(getOfferStatus(closed, now + 1000)).toBe('ended')
  })
})
