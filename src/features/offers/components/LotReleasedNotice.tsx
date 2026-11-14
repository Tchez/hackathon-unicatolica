import { X, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { SimulatedBadge } from '../../../components/SimulatedBadge'
import { useCurrentUser } from '../../account/accountStore'
import { usePointsStore } from '../../points/pointsStore'
import { useOffersStore } from '../offersStore'
import { findReleasedLot, offerHeadline } from './offerView'
import { useNow } from './useNow'

const AUTO_HIDE_MS = 10_000
const STORAGE_KEY = 'fidelidade:dismissed-lot-notices'

function readDismissed(): string[] {
  try {
    const raw: unknown = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? '[]')
    return Array.isArray(raw) ? raw.filter((item): item is string => typeof item === 'string') : []
  } catch {
    return []
  }
}

function writeDismissed(keys: string[]): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(keys))
  } catch {
    // Sem sessionStorage, o aviso dispensado só fica oculto enquanto esta aba está aberta.
  }
}

/**
 * Aviso no topo do app: um lote foi liberado e a pessoa marcou "Estou no shopping" (simulação,
 * Q09). Some ao resgatar, ao dispensar (vale para a aba), em 10 s ou 5 min depois da liberação.
 */
export function LotReleasedNotice() {
  const user = useCurrentUser()
  const present = useOffersStore((state) => (user ? state.presentUserIds.includes(user.id) : false))
  const offers = useOffersStore((state) => state.offers)
  const coupons = usePointsStore((state) => state.coupons)
  const now = useNow()
  const [dismissed, setDismissed] = useState<string[]>(readDismissed)

  const claimedOfferIds = user
    ? coupons
        .filter((coupon) => coupon.userId === user.id && coupon.source === 'offer')
        .map((coupon) => coupon.sourceId)
    : []
  const active = user?.role === 'visitor' && present
  const lot = active ? findReleasedLot(offers, claimedOfferIds, now) : undefined
  const key = lot && !dismissed.includes(lot.key) ? lot.key : undefined

  const dismiss = (lotKey: string) =>
    setDismissed((keys) => {
      const next = keys.includes(lotKey) ? keys : [...keys, lotKey]
      writeDismissed(next)
      return next
    })

  useEffect(() => {
    if (!key) return
    const timer = setTimeout(() => dismiss(key), AUTO_HIDE_MS)
    return () => clearTimeout(timer)
  }, [key])

  if (!lot || !key) return null
  const title = lot.offer.campaignId === undefined ? 'Nova oferta relâmpago' : 'Lote liberado agora'

  return (
    <div role="status" className="relative z-20 flex items-center gap-2 bg-green px-4 py-1 text-white">
      <Zap aria-hidden className="size-5 flex-none" />
      <div className="min-w-0 flex-1 text-sm">
        <p className="truncate font-semibold">{title}</p>
        <p className="flex min-w-0 items-center gap-2 text-[13px]">
          <span className="truncate opacity-90">{offerHeadline(lot.offer)}</span>
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
        aria-label="Fechar aviso"
        onClick={() => dismiss(key)}
        className="flex size-11 flex-none items-center justify-center"
      >
        <X aria-hidden className="size-5" />
      </button>
    </div>
  )
}
