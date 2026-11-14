import { getOfferStatus, type OfferStatus } from '../../../lib/offers'
import type { Offer } from '../../../types'

// P2 do design: o lote liberado dura 5 min. Enquanto isso, quem marcou presença vê o aviso no topo.
export const LOT_NOTICE_WINDOW_MS = 5 * 60_000

export const STATUS_LABELS: Record<OfferStatus, string> = {
  live: 'Liberada',
  upcoming: 'Em breve',
  sold_out: 'Esgotada',
  ended: 'Encerrada',
}

const STATUS_ORDER: Record<OfferStatus, number> = { live: 0, upcoming: 1, sold_out: 2, ended: 3 }

/** Título com o desconto: acrescenta "· 30% OFF" só quando o título ainda não o cita. */
export function offerHeadline(offer: Pick<Offer, 'title' | 'discountPercent'>): string {
  return offer.title.includes(`${offer.discountPercent}%`)
    ? offer.title
    : `${offer.title} · ${offer.discountPercent}% OFF`
}

function releaseTime(batch: { releaseAt: string }): number {
  return new Date(batch.releaseAt).getTime()
}

/** Unidades dos lotes já liberados em `now` (total da barra de estoque). */
export function getReleasedQuantity(offer: Offer, now: number): number {
  return offer.batches
    .filter((batch) => releaseTime(batch) <= now)
    .reduce((sum, batch) => sum + batch.quantity, 0)
}

/** Ofertas ordenadas por estado: liberadas, em breve, esgotadas e encerradas (estável dentro de cada grupo). */
export function sortByStatus(offers: Offer[], now: number): Offer[] {
  return offers
    .map((offer, index) => ({ offer, index, order: STATUS_ORDER[getOfferStatus(offer, now)] }))
    .sort((a, b) => a.order - b.order || a.index - b.index)
    .map(({ offer }) => offer)
}

/** Fim da campanha: o último prazo entre as ofertas dela. Sem ofertas, não há prazo. */
export function campaignEndsAt(campaignOffers: Offer[]): number | undefined {
  if (campaignOffers.length === 0) return undefined
  return Math.max(...campaignOffers.map((offer) => new Date(offer.endsAt).getTime()))
}

/** Alternativas a uma oferta esgotada: liberadas, de outras lojas e, havendo campanha, da mesma campanha. */
export function findAlternatives(offer: Offer, offers: Offer[], now: number): Offer[] {
  return offers.filter(
    (other) =>
      other.id !== offer.id &&
      other.storeId !== offer.storeId &&
      (offer.campaignId === undefined || other.campaignId === offer.campaignId) &&
      getOfferStatus(other, now) === 'live',
  )
}

/** Última liberação de lote até `now` (0 se nenhum lote foi liberado). */
function lastRelease(offer: Offer, now: number): number {
  return offer.batches
    .map(releaseTime)
    .filter((time) => time <= now)
    .reduce((latest, time) => Math.max(latest, time), 0)
}

/** Oferta relâmpago ativa para o carrossel: a de lote mais recente, para a recém-criada aparecer. */
export function pickFlashOffer(offers: Offer[], now: number): Offer | undefined {
  return offers
    .filter((offer) => offer.campaignId === undefined && getOfferStatus(offer, now) === 'live')
    .sort((a, b) => lastRelease(b, now) - lastRelease(a, now))[0]
}

export interface ReleasedLot {
  offer: Offer
  /** Identifica a liberação (oferta e horário), para o aviso poder ser dispensado. */
  key: string
}

/**
 * Lote recém-liberado que ainda vale avisar: oferta com saldo, lote liberado há menos de
 * `LOT_NOTICE_WINDOW_MS` e que a pessoa ainda não resgatou. Devolve o mais recente.
 */
export function findReleasedLot(
  offers: Offer[],
  claimedOfferIds: string[],
  now: number,
): ReleasedLot | undefined {
  const candidates = offers
    .filter((offer) => !claimedOfferIds.includes(offer.id) && getOfferStatus(offer, now) === 'live')
    .map((offer) => ({ offer, releasedAt: lastRelease(offer, now) }))
    .filter(({ releasedAt }) => releasedAt > 0 && now - releasedAt <= LOT_NOTICE_WINDOW_MS)
    .sort((a, b) => b.releasedAt - a.releasedAt)
  const latest = candidates[0]
  return latest ? { offer: latest.offer, key: `${latest.offer.id}@${latest.releasedAt}` } : undefined
}

const pointsFormat = new Intl.NumberFormat('pt-BR')

/** Pontos com separador de milhar em pt-BR: 1200 → "1.200". */
export function formatPoints(points: number): string {
  return pointsFormat.format(points)
}
