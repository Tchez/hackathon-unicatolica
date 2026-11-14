import type { Offer } from '../types'

export type OfferStatus = 'upcoming' | 'live' | 'sold_out' | 'ended'

/** Unidades dos lotes já liberados em `now`. */
function releasedQuantity(offer: Offer, now: number): number {
  return offer.batches
    .filter((batch) => new Date(batch.releaseAt).getTime() <= now)
    .reduce((sum, batch) => sum + batch.quantity, 0)
}

/** Quantidade restante: unidades dos lotes liberados menos as já resgatadas. */
export function getRemaining(offer: Offer, now: number = Date.now()): number {
  return Math.max(0, releasedQuantity(offer, now) - offer.redeemedCount)
}

/** Estado da oferta: encerrada (prazo), em breve (nenhum lote liberado), esgotada ou liberada. */
export function getOfferStatus(offer: Offer, now: number = Date.now()): OfferStatus {
  if (new Date(offer.endsAt).getTime() <= now) return 'ended'
  if (releasedQuantity(offer, now) === 0) return 'upcoming'
  if (getRemaining(offer, now) === 0) return 'sold_out'
  return 'live'
}
