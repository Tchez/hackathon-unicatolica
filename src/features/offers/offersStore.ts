import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createCampaigns, createOffers } from '../../data/offers'
import { createStores } from '../../data/stores'
import { createCoupon } from '../../lib/coupon'
import { createId } from '../../lib/id'
import { getOfferStatus, getRemaining, type OfferStatus } from '../../lib/offers'
import { localJSONStorage, storageKey } from '../../lib/storage'
import { registerStore } from '../../lib/storeRegistry'
import type { Campaign, Coupon, Offer, Result, Store } from '../../types'
import { getUser } from '../account/accountStore'
import { usePointsStore } from '../points/pointsStore'

export { getOfferStatus, getRemaining }
export type { OfferStatus }

export type ClaimCouponError =
  'invalid_user' | 'offer_not_found' | 'upcoming' | 'sold_out' | 'ended' | 'already_claimed'

export type OfferActionError = 'offer_not_found' | 'ended' | 'invalid_quantity'
export type CreateFlashOfferError = 'store_not_found' | 'invalid_input'

export interface FlashOfferInput {
  storeId: string
  title: string
  discountPercent: number
  durationMinutes: number
  quantity: number
}

interface OffersState {
  stores: Store[]
  campaigns: Campaign[]
  offers: Offer[]
  /** Ids dos visitantes que marcaram "Estou no shopping" (simulação, Q09). */
  presentUserIds: string[]
  /**
   * Resgata o cupom de uma oferta: exige oferta liberada com saldo e dentro do prazo, e um cupom
   * por pessoa por oferta. Gera um cupom válido por 60 min e conta o resgate.
   */
  claimCoupon: (userId: string, offerId: string, now?: number) => Result<Coupon, ClaimCouponError>
  /** Shopping: acrescenta um lote com `releaseAt` igual ao momento da chamada. */
  releaseBatch: (offerId: string, quantity: number, now?: number) => Result<Offer, OfferActionError>
  /** Lojista: publica uma oferta relâmpago já liberada, com a quantidade e a duração informadas. */
  createFlashOffer: (input: FlashOfferInput, now?: number) => Result<Offer, CreateFlashOfferError>
  /** Encerra a oferta antes do prazo. */
  closeOffer: (offerId: string, now?: number) => Result<Offer, 'offer_not_found'>
  /** Simulação de "Estou no shopping". */
  markPresence: (userId: string, present: boolean) => void
  getOfferStatus: (offer: Offer, now?: number) => OfferStatus
  getRemaining: (offer: Offer, now?: number) => number
}

function initialData(now: number = Date.now()) {
  return {
    stores: createStores(),
    campaigns: createCampaigns(now),
    offers: createOffers(now),
    presentUserIds: [] as string[],
  }
}

export const useOffersStore = create<OffersState>()(
  persist(
    (set, get) => {
      const update = (offerId: string, change: (offer: Offer) => Offer): Offer | undefined => {
        let updated: Offer | undefined
        set((state) => ({
          offers: state.offers.map((offer) => {
            if (offer.id !== offerId) return offer
            updated = change(offer)
            return updated
          }),
        }))
        return updated
      }

      return {
        ...initialData(),
        claimCoupon: (userId, offerId, now = Date.now()) => {
          if (getUser(userId)?.role !== 'visitor') return { ok: false, error: 'invalid_user' }
          const offer = get().offers.find((item) => item.id === offerId)
          if (!offer) return { ok: false, error: 'offer_not_found' }
          const status = getOfferStatus(offer, now)
          if (status === 'ended') return { ok: false, error: 'ended' }
          if (status === 'upcoming') return { ok: false, error: 'upcoming' }
          if (status === 'sold_out') return { ok: false, error: 'sold_out' }
          const alreadyClaimed = usePointsStore
            .getState()
            .coupons.some((c) => c.userId === userId && c.source === 'offer' && c.sourceId === offerId)
          if (alreadyClaimed) return { ok: false, error: 'already_claimed' }

          const coupon = createCoupon(userId, 'offer', offerId, now)
          update(offerId, (current) => ({ ...current, redeemedCount: current.redeemedCount + 1 }))
          usePointsStore.getState().addCoupon(coupon)
          return { ok: true, value: coupon }
        },
        releaseBatch: (offerId, quantity, now = Date.now()) => {
          const offer = get().offers.find((item) => item.id === offerId)
          if (!offer) return { ok: false, error: 'offer_not_found' }
          if (!Number.isInteger(quantity) || quantity <= 0) return { ok: false, error: 'invalid_quantity' }
          if (new Date(offer.endsAt).getTime() <= now) return { ok: false, error: 'ended' }
          const updated = update(offerId, (current) => ({
            ...current,
            batches: [...current.batches, { releaseAt: new Date(now).toISOString(), quantity }],
          }))
          return { ok: true, value: updated as Offer }
        },
        createFlashOffer: (input, now = Date.now()) => {
          if (!get().stores.some((store) => store.id === input.storeId)) {
            return { ok: false, error: 'store_not_found' }
          }
          const valid =
            input.title.trim().length > 0 &&
            Number.isInteger(input.discountPercent) &&
            input.discountPercent >= 1 &&
            input.discountPercent <= 99 &&
            input.durationMinutes > 0 &&
            Number.isInteger(input.quantity) &&
            input.quantity > 0
          if (!valid) return { ok: false, error: 'invalid_input' }
          const offer: Offer = {
            id: createId('offer'),
            storeId: input.storeId,
            title: input.title.trim(),
            discountPercent: input.discountPercent,
            batches: [{ releaseAt: new Date(now).toISOString(), quantity: input.quantity }],
            endsAt: new Date(now + input.durationMinutes * 60_000).toISOString(),
            redeemedCount: 0,
          }
          set((state) => ({ offers: [...state.offers, offer] }))
          return { ok: true, value: offer }
        },
        closeOffer: (offerId, now = Date.now()) => {
          if (!get().offers.some((item) => item.id === offerId))
            return { ok: false, error: 'offer_not_found' }
          const updated = update(offerId, (current) =>
            new Date(current.endsAt).getTime() > now
              ? { ...current, endsAt: new Date(now).toISOString() }
              : current,
          )
          return { ok: true, value: updated as Offer }
        },
        markPresence: (userId, present) =>
          set((state) => {
            const others = state.presentUserIds.filter((id) => id !== userId)
            return { presentUserIds: present ? [...others, userId] : others }
          }),
        getOfferStatus,
        getRemaining,
      }
    },
    {
      name: storageKey('offers'),
      storage: localJSONStorage,
      partialize: (state) => ({
        stores: state.stores,
        campaigns: state.campaigns,
        offers: state.offers,
        presentUserIds: state.presentUserIds,
      }),
    },
  ),
)

registerStore({
  storageKey: storageKey('offers'),
  rehydrate: () => useOffersStore.persist.rehydrate(),
  reset: () => useOffersStore.setState(initialData()),
})
