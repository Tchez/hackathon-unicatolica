import { X, Zap } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
import { SimulatedBadge } from '../../../components/SimulatedBadge'
import { useCurrentUser } from '../../account/accountStore'
import { usePointsStore } from '../../points/pointsStore'
import { useOffersStore } from '../offersStore'
import { findReleasedLot, offerHeadline } from './offerView'
import { useNow } from './useNow'

/**
 * Aviso no topo do app: um lote foi liberado e a pessoa marcou "Estou no shopping" (simulação,
 * Q09). Some ao resgatar, ao dispensar ou 5 min depois da liberação.
 */
export function LotReleasedNotice() {
  const user = useCurrentUser()
  const present = useOffersStore((state) => (user ? state.presentUserIds.includes(user.id) : false))
  const offers = useOffersStore((state) => state.offers)
  const coupons = usePointsStore((state) => state.coupons)
  const now = useNow()
  const [dismissed, setDismissed] = useState<string[]>([])

  if (!user || user.role !== 'visitor' || !present) return null
  const claimedOfferIds = coupons
    .filter((coupon) => coupon.userId === user.id && coupon.source === 'offer')
    .map((coupon) => coupon.sourceId)
  const lot = findReleasedLot(offers, claimedOfferIds, now)
  if (!lot || dismissed.includes(lot.key)) return null

  return (
    <div role="status" className="flex items-center gap-2 bg-green px-4 py-1 text-white">
      <Zap aria-hidden className="size-5 flex-none" />
      <div className="min-w-0 flex-1 text-sm">
        <p className="font-semibold whitespace-nowrap">Lote liberado agora</p>
        <p className="flex items-center gap-2 text-[13px]">
          <span className="min-w-0 truncate opacity-90">{offerHeadline(lot.offer)}</span>
          <SimulatedBadge />
        </p>
      </div>
      <Link
        to={`/visitor/offers/${lot.offer.id}`}
        className="flex min-h-11 flex-none items-center px-2 text-sm font-semibold underline"
      >
        Ver oferta
      </Link>
      <button
        type="button"
        aria-label="Dispensar aviso"
        onClick={() => setDismissed((keys) => [...keys, lot.key])}
        className="flex size-11 flex-none items-center justify-center"
      >
        <X aria-hidden className="size-5" />
      </button>
    </div>
  )
}
