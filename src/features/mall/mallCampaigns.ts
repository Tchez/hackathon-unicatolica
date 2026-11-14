import { getOfferStatus } from '../../lib/offers'
import type { Campaign, Offer } from '../../types'
import { getCampaignOffers } from './mallOffers'

export type CampaignKind = 'past' | 'current' | 'next'
export type CampaignStatus = 'ongoing' | 'ended' | 'preparing'

export interface CampaignResult {
  couponsRedeemed: number
  purchases: number
}

export interface CampaignSummary {
  id: string
  name: string
  /** Data ISO da campanha. */
  date: string
  storeCount: number
  kind: CampaignKind
  status: CampaignStatus
  description: string
  /** Resultado agregado, só nas campanhas passadas de demonstração. */
  result?: CampaignResult
  /** Campanha de demonstração, que não vem dos dados do navegador (leva o selo de simulação). */
  simulated: boolean
}

// Campanha passada e próxima de demonstração: os dados simulados só trazem a campanha atual (P10 do design).
const DEMO_PAST = {
  id: 'demo-campaign-1010',
  name: '10/10 no Capim',
  month: 9,
  day: 10,
  storeCount: 4,
  description: 'Campanha encerrada.',
  result: { couponsRedeemed: 41, purchases: 29 },
}
const DEMO_NEXT = {
  id: 'demo-campaign-1212',
  name: '12/12 no Capim',
  month: 11,
  day: 12,
  storeCount: 5,
  description: 'Lotes e ofertas a definir com as lojas.',
}

/** Campanha tem alguma oferta que ainda não encerrou. */
function hasOpenOffer(offers: Offer[], campaignId: string, now: number): boolean {
  return getCampaignOffers(offers, campaignId).some((offer) => getOfferStatus(offer, now) !== 'ended')
}

const byDateDesc = (a: Campaign, b: Campaign) => new Date(b.date).getTime() - new Date(a.date).getTime()

/**
 * Campanha atual: a mais recente que ainda tem oferta em andamento; se todas encerraram,
 * a mais recente. Sem campanhas, `undefined`.
 */
export function getCurrentCampaign(
  campaigns: Campaign[],
  offers: Offer[],
  now: number = Date.now(),
): Campaign | undefined {
  const sorted = [...campaigns].sort(byDateDesc)
  return sorted.find((campaign) => hasOpenOffer(offers, campaign.id, now)) ?? sorted[0]
}

/** Data fixa (dia e mês, às 10h) mais próxima de `reference`, no ano certo para ficar antes ou depois dele. */
function demoDate(reference: Date, month: number, day: number, side: 'before' | 'after'): string {
  const year = reference.getFullYear()
  let candidate = new Date(year, month, day, 10)
  if (side === 'before' && candidate >= reference) candidate = new Date(year - 1, month, day, 10)
  if (side === 'after' && candidate <= reference) candidate = new Date(year + 1, month, day, 10)
  return candidate.toISOString()
}

/**
 * Lista para a tela de campanhas, da mais antiga à mais nova: passadas, atual e próxima.
 * As reais vêm dos dados; a passada (10/10) e a próxima (12/12) de demonstração completam a linha do tempo.
 */
export function buildCampaignList(
  campaigns: Campaign[],
  offers: Offer[],
  now: number = Date.now(),
): CampaignSummary[] {
  const current = getCurrentCampaign(campaigns, offers, now)
  const currentTime = current ? new Date(current.date).getTime() : now

  const real = campaigns.map((campaign): CampaignSummary => {
    const isCurrent = campaign.id === current?.id
    const kind: CampaignKind = isCurrent
      ? 'current'
      : new Date(campaign.date).getTime() > currentTime
        ? 'next'
        : 'past'
    const open = hasOpenOffer(offers, campaign.id, now)
    return {
      id: campaign.id,
      name: campaign.name,
      date: campaign.date,
      storeCount: campaign.storeIds.length,
      kind,
      status: kind === 'next' ? 'preparing' : open ? 'ongoing' : 'ended',
      description: campaign.description,
      simulated: false,
    }
  })

  const reference = new Date(currentTime)
  const past: CampaignSummary = {
    id: DEMO_PAST.id,
    name: DEMO_PAST.name,
    date: demoDate(reference, DEMO_PAST.month, DEMO_PAST.day, 'before'),
    storeCount: DEMO_PAST.storeCount,
    kind: 'past',
    status: 'ended',
    description: DEMO_PAST.description,
    result: DEMO_PAST.result,
    simulated: true,
  }
  const next: CampaignSummary = {
    id: DEMO_NEXT.id,
    name: DEMO_NEXT.name,
    date: demoDate(reference, DEMO_NEXT.month, DEMO_NEXT.day, 'after'),
    storeCount: DEMO_NEXT.storeCount,
    kind: 'next',
    status: 'preparing',
    description: DEMO_NEXT.description,
    simulated: true,
  }

  return [past, ...real, next].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}
