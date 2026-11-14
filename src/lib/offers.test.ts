import { describe, expect, it } from 'vitest'
import type { Offer } from '../types'
import { getOfferStatus, getRemaining } from './offers'

const NOW = Date.parse('2026-11-14T12:00:00Z')

function offer(overrides: Partial<Offer> = {}): Offer {
  return {
    id: 'o1',
    storeId: 's1',
    title: 'Oferta',
    discountPercent: 60,
    batches: [{ releaseAt: '2026-11-14T11:00:00Z', quantity: 5 }],
    endsAt: '2026-11-14T13:00:00Z',
    redeemedCount: 0,
    ...overrides,
  }
}

describe('getOfferStatus', () => {
  it('está liberada com lote liberado e saldo', () => {
    expect(getOfferStatus(offer(), NOW)).toBe('live')
  })

  it('está em breve sem lote liberado', () => {
    expect(getOfferStatus(offer({ batches: [] }), NOW)).toBe('upcoming')
    const future = [{ releaseAt: '2026-11-14T12:30:00Z', quantity: 5 }]
    expect(getOfferStatus(offer({ batches: future }), NOW)).toBe('upcoming')
  })

  it('está esgotada quando tudo foi resgatado', () => {
    expect(getOfferStatus(offer({ redeemedCount: 5 }), NOW)).toBe('sold_out')
  })

  it('está encerrada após o prazo, mesmo esgotada ou em breve', () => {
    expect(getOfferStatus(offer({ endsAt: '2026-11-14T12:00:00Z' }), NOW)).toBe('ended')
    expect(getOfferStatus(offer({ endsAt: '2026-11-14T11:59:00Z', redeemedCount: 5 }), NOW)).toBe('ended')
    expect(getOfferStatus(offer({ endsAt: '2026-11-14T11:59:00Z', batches: [] }), NOW)).toBe('ended')
  })

  it('volta a ficar liberada quando um novo lote é liberado', () => {
    const batches = [
      { releaseAt: '2026-11-14T11:00:00Z', quantity: 5 },
      { releaseAt: '2026-11-14T11:50:00Z', quantity: 3 },
    ]
    expect(getOfferStatus(offer({ batches, redeemedCount: 5 }), NOW)).toBe('live')
  })
})

describe('getRemaining', () => {
  it('conta só lotes liberados', () => {
    const batches = [
      { releaseAt: '2026-11-14T11:00:00Z', quantity: 5 },
      { releaseAt: '2026-11-14T15:00:00Z', quantity: 10 },
    ]
    expect(getRemaining(offer({ batches, redeemedCount: 2 }), NOW)).toBe(3)
  })

  it('nunca fica negativa', () => {
    expect(getRemaining(offer({ redeemedCount: 9 }), NOW)).toBe(0)
  })
})
