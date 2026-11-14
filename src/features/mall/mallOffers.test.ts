import { describe, expect, it } from 'vitest'
import type { Offer } from '../../types'
import {
  getActiveFlashOffers,
  getCampaignEndsAt,
  getCampaignOffers,
  getOfferBatchOverview,
  parseBatchQuantity,
} from './mallOffers'

const NOW = Date.parse('2026-11-14T12:00:00.000Z')
const MIN = 60_000
const at = (offset: number) => new Date(NOW + offset).toISOString()

function makeOffer(overrides: Partial<Offer>): Offer {
  return {
    id: 'offer',
    storeId: 'store-techplay',
    title: 'Oferta',
    discountPercent: 10,
    batches: [],
    endsAt: at(60 * MIN),
    redeemedCount: 0,
    ...overrides,
  }
}

describe('getOfferBatchOverview', () => {
  it('oferta sem lote: em breve, nada liberado nem restante', () => {
    const overview = getOfferBatchOverview(makeOffer({}), NOW)
    expect(overview).toMatchObject({
      status: 'upcoming',
      batches: [],
      releasedBatches: 0,
      releasedQuantity: 0,
      scheduledQuantity: 0,
      remaining: 0,
    })
  })

  it('soma lotes liberados e desconta os resgatados', () => {
    const overview = getOfferBatchOverview(
      makeOffer({
        batches: [
          { releaseAt: at(-20 * MIN), quantity: 40 },
          { releaseAt: at(-1 * MIN), quantity: 5 },
        ],
        redeemedCount: 12,
      }),
      NOW,
    )
    expect(overview.status).toBe('live')
    expect(overview.releasedBatches).toBe(2)
    expect(overview.releasedQuantity).toBe(45)
    expect(overview.redeemed).toBe(12)
    expect(overview.remaining).toBe(33)
  })

  it('separa lote programado do liberado e ordena por horário', () => {
    const overview = getOfferBatchOverview(
      makeOffer({
        batches: [
          { releaseAt: at(30 * MIN), quantity: 10 },
          { releaseAt: at(-5 * MIN), quantity: 20 },
        ],
      }),
      NOW,
    )
    expect(overview.batches.map((b) => [b.position, b.quantity, b.released])).toEqual([
      [1, 20, true],
      [2, 10, false],
    ])
    expect(overview.releasedQuantity).toBe(20)
    expect(overview.scheduledQuantity).toBe(10)
    expect(overview.remaining).toBe(20)
  })

  it('esgotada quando tudo o que foi liberado foi resgatado', () => {
    const overview = getOfferBatchOverview(
      makeOffer({ batches: [{ releaseAt: at(-MIN), quantity: 5 }], redeemedCount: 5 }),
      NOW,
    )
    expect(overview.status).toBe('sold_out')
    expect(overview.remaining).toBe(0)
  })

  it('encerrada depois do prazo', () => {
    const overview = getOfferBatchOverview(
      makeOffer({ batches: [{ releaseAt: at(-MIN), quantity: 5 }], endsAt: at(-1) }),
      NOW,
    )
    expect(overview.status).toBe('ended')
  })
})

describe('campanha', () => {
  const offers = [
    makeOffer({ id: 'a', campaignId: 'c1', endsAt: at(10 * MIN) }),
    makeOffer({ id: 'b', campaignId: 'c1', endsAt: at(90 * MIN) }),
    makeOffer({ id: 'c', campaignId: 'c2' }),
    makeOffer({ id: 'd' }),
  ]

  it('lista só as ofertas da campanha', () => {
    expect(getCampaignOffers(offers, 'c1').map((o) => o.id)).toEqual(['a', 'b'])
  })

  it('o fim da campanha é o último prazo entre as ofertas', () => {
    expect(getCampaignEndsAt(offers, 'c1')).toBe(NOW + 90 * MIN)
    expect(getCampaignEndsAt(offers, 'sem-ofertas')).toBeUndefined()
  })
})

describe('getActiveFlashOffers', () => {
  const batch = [{ releaseAt: at(-MIN), quantity: 10 }]

  it('ignora ofertas de campanha e encerradas', () => {
    const list = getActiveFlashOffers(
      [
        makeOffer({ id: 'campanha', campaignId: 'c1', batches: batch }),
        makeOffer({ id: 'encerrada', batches: batch, endsAt: at(-1) }),
        makeOffer({ id: 'ativa', batches: batch }),
      ],
      NOW,
    )
    expect(list.map((o) => o.id)).toEqual(['ativa'])
  })

  it('mantém a esgotada, depois das liberadas, e ordena pelo prazo', () => {
    const list = getActiveFlashOffers(
      [
        makeOffer({ id: 'esgotada', batches: batch, redeemedCount: 10, endsAt: at(5 * MIN) }),
        makeOffer({ id: 'tarde', batches: batch, endsAt: at(50 * MIN) }),
        makeOffer({ id: 'cedo', batches: batch, endsAt: at(20 * MIN) }),
      ],
      NOW,
    )
    expect(list.map((o) => o.id)).toEqual(['cedo', 'tarde', 'esgotada'])
  })
})

describe('parseBatchQuantity', () => {
  it('aceita inteiro maior que zero, com espaços nas pontas', () => {
    expect(parseBatchQuantity('5')).toBe(5)
    expect(parseBatchQuantity(' 12 ')).toBe(12)
  })

  it('recusa vazio, zero, decimal, negativo, texto e número gigante', () => {
    for (const text of ['', ' ', '0', '2,5', '2.5', '-3', 'abc', '1e3', '99999999999999999999']) {
      expect(parseBatchQuantity(text), text).toBeUndefined()
    }
  })
})
