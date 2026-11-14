import { getOfferStatus, getRemaining, type OfferStatus } from '../../lib/offers'
import type { Offer } from '../../types'

export interface BatchView {
  /** Posição do lote na ordem de liberação, a partir de 1. */
  position: number
  quantity: number
  releaseAt: string
  /** Já liberado no momento consultado. */
  released: boolean
}

/** Situação dos lotes de uma oferta: o que já saiu, o que foi resgatado e o que resta. */
export interface OfferBatchOverview {
  status: OfferStatus
  batches: BatchView[]
  releasedBatches: number
  /** Unidades dos lotes já liberados. */
  releasedQuantity: number
  /** Unidades de lotes programados para depois. */
  scheduledQuantity: number
  redeemed: number
  /** Liberadas menos resgatadas. */
  remaining: number
}

/** Resume lotes liberados e restantes de uma oferta, no instante `now`. */
export function getOfferBatchOverview(offer: Offer, now: number = Date.now()): OfferBatchOverview {
  const batches: BatchView[] = [...offer.batches]
    .sort((a, b) => new Date(a.releaseAt).getTime() - new Date(b.releaseAt).getTime())
    .map((batch, index) => ({
      position: index + 1,
      quantity: batch.quantity,
      releaseAt: batch.releaseAt,
      released: new Date(batch.releaseAt).getTime() <= now,
    }))
  const sum = (items: BatchView[]) => items.reduce((total, batch) => total + batch.quantity, 0)
  const released = batches.filter((batch) => batch.released)
  return {
    status: getOfferStatus(offer, now),
    batches,
    releasedBatches: released.length,
    releasedQuantity: sum(released),
    scheduledQuantity: sum(batches.filter((batch) => !batch.released)),
    redeemed: offer.redeemedCount,
    remaining: getRemaining(offer, now),
  }
}

/** Ofertas de uma campanha, na ordem em que estão nos dados. */
export function getCampaignOffers(offers: Offer[], campaignId: string): Offer[] {
  return offers.filter((offer) => offer.campaignId === campaignId)
}

/** Fim da campanha: o último prazo entre as ofertas dela, em ms. Sem ofertas, `undefined`. */
export function getCampaignEndsAt(offers: Offer[], campaignId: string): number | undefined {
  const ends = getCampaignOffers(offers, campaignId).map((offer) => new Date(offer.endsAt).getTime())
  return ends.length > 0 ? Math.max(...ends) : undefined
}

const FLASH_STATUS_ORDER: Record<OfferStatus, number> = { live: 0, upcoming: 1, sold_out: 2, ended: 3 }

/**
 * Ofertas relâmpago ativas das lojas: sem campanha e não encerradas (por prazo ou pela loja).
 * As liberadas vêm primeiro; dentro do mesmo estado, as que terminam antes.
 */
export function getActiveFlashOffers(offers: Offer[], now: number = Date.now()): Offer[] {
  return offers
    .filter((offer) => !offer.campaignId && getOfferStatus(offer, now) !== 'ended')
    .sort(
      (a, b) =>
        FLASH_STATUS_ORDER[getOfferStatus(a, now)] - FLASH_STATUS_ORDER[getOfferStatus(b, now)] ||
        new Date(a.endsAt).getTime() - new Date(b.endsAt).getTime(),
    )
}

/** Lê a quantidade digitada: só inteiro maior que zero. Qualquer outra coisa devolve `undefined`. */
export function parseBatchQuantity(text: string): number | undefined {
  const trimmed = text.trim()
  if (!/^\d+$/.test(trimmed)) return undefined
  const value = Number(trimmed)
  return Number.isSafeInteger(value) && value > 0 ? value : undefined
}
