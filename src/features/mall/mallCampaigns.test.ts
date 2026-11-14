import { describe, expect, it } from 'vitest'
import type { Campaign, Offer } from '../../types'
import { buildCampaignList, getCurrentCampaign } from './mallCampaigns'

const NOW = new Date(2026, 10, 14, 10).getTime() // 14/11/2026 10h, horário local
const HOUR = 3_600_000

const campaign1111: Campaign = {
  id: 'campaign-1111',
  name: '11/11 no Capim',
  date: new Date(NOW).toISOString(),
  storeIds: ['a', 'b', 'c'],
  description: 'Ofertas em lotes.',
}

const offer = (campaignId: string, endsAt: number): Offer => ({
  id: `offer-${campaignId}-${endsAt}`,
  storeId: 'store-techplay',
  campaignId,
  title: 'Oferta',
  discountPercent: 10,
  batches: [],
  endsAt: new Date(endsAt).toISOString(),
  redeemedCount: 0,
})

const day = (iso: string) => {
  const date = new Date(iso)
  return [date.getDate(), date.getMonth() + 1, date.getFullYear()]
}

describe('getCurrentCampaign', () => {
  it('escolhe a campanha com oferta em andamento', () => {
    const older: Campaign = { ...campaign1111, id: 'old', date: new Date(NOW - 30 * 24 * HOUR).toISOString() }
    const offers = [offer('old', NOW + HOUR), offer('campaign-1111', NOW - HOUR)]
    expect(getCurrentCampaign([campaign1111, older], offers, NOW)?.id).toBe('old')
  })

  it('sem oferta em andamento, fica com a mais recente', () => {
    const older: Campaign = { ...campaign1111, id: 'old', date: new Date(NOW - 30 * 24 * HOUR).toISOString() }
    expect(getCurrentCampaign([older, campaign1111], [], NOW)?.id).toBe('campaign-1111')
  })

  it('sem campanhas, devolve undefined', () => {
    expect(getCurrentCampaign([], [], NOW)).toBeUndefined()
  })
})

describe('buildCampaignList', () => {
  const offers = [offer('campaign-1111', NOW + 24 * HOUR)]

  it('ordena passada, atual e próxima, com data e número de lojas', () => {
    const list = buildCampaignList([campaign1111], offers, NOW)
    expect(list.map((item) => item.kind)).toEqual(['past', 'current', 'next'])
    expect(list.map((item) => item.name)).toEqual(['10/10 no Capim', '11/11 no Capim', '12/12 no Capim'])
    expect(day(list[0].date)).toEqual([10, 10, 2026])
    expect(day(list[2].date)).toEqual([12, 12, 2026])
    expect(list.map((item) => item.storeCount)).toEqual([4, 3, 5])
  })

  it('marca como simulação só as campanhas de demonstração', () => {
    const list = buildCampaignList([campaign1111], offers, NOW)
    expect(list.map((item) => item.simulated)).toEqual([true, false, true])
  })

  it('estado: passada encerrada, atual em andamento, próxima em preparação', () => {
    const list = buildCampaignList([campaign1111], offers, NOW)
    expect(list.map((item) => item.status)).toEqual(['ended', 'ongoing', 'preparing'])
  })

  it('a atual vira encerrada quando todas as ofertas acabam', () => {
    const list = buildCampaignList([campaign1111], [offer('campaign-1111', NOW - HOUR)], NOW)
    expect(list.find((item) => item.kind === 'current')?.status).toBe('ended')
  })

  it('a passada de demonstração traz só números agregados', () => {
    const [past] = buildCampaignList([campaign1111], offers, NOW)
    expect(past.result).toEqual({ couponsRedeemed: 41, purchases: 29 })
  })

  it('mantém a ordem mesmo quando a campanha atual cai no começo do ano', () => {
    const january = new Date(2027, 0, 5, 10)
    const list = buildCampaignList(
      [{ ...campaign1111, date: january.toISOString() }],
      [offer('campaign-1111', january.getTime() + HOUR)],
      january.getTime(),
    )
    expect(list.map((item) => item.kind)).toEqual(['past', 'current', 'next'])
    expect(day(list[0].date)).toEqual([10, 10, 2026])
  })

  it('sem campanhas reais, mostra só as de demonstração', () => {
    const list = buildCampaignList([], [], NOW)
    expect(list.map((item) => item.kind)).toEqual(['past', 'next'])
  })
})
