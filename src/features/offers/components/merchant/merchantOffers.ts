import { getOfferStatus, type OfferStatus } from '../../../../lib/offers'
import type { Offer } from '../../../../types'

export interface MerchantOffer {
  offer: Offer
  status: OfferStatus
}

// Ofertas em andamento primeiro; dentro do mesmo estado, a mais recente no topo.
const STATUS_RANK: Record<OfferStatus, number> = { live: 0, upcoming: 1, sold_out: 2, ended: 3 }

/** Ofertas da loja com o estado em `now`, ordenadas para a lista "Suas ofertas". */
export function getMerchantOffers(offers: Offer[], storeId: string, now: number): MerchantOffer[] {
  return offers
    .map((offer, index) => ({ offer, index, status: getOfferStatus(offer, now) }))
    .filter(({ offer }) => offer.storeId === storeId)
    .sort((a, b) => STATUS_RANK[a.status] - STATUS_RANK[b.status] || b.index - a.index)
    .map(({ offer, status }) => ({ offer, status }))
}
