import { formatCountdown } from '../../../lib/format'
import type { Offer } from '../../../types'
import { formatCount } from '../mallFormat'
import { getOfferBatchOverview } from '../mallOffers'
import { OfferStatusChip } from './OfferStatusChip'

interface FlashOfferCardProps {
  offer: Offer
  storeName: string
  /** Relógio real da tela. */
  now: number
}

/** Oferta relâmpago de uma loja: estado, contagem regressiva e unidades restantes. */
export function FlashOfferCard({ offer, storeName, now }: FlashOfferCardProps) {
  const overview = getOfferBatchOverview(offer, now)
  const msLeft = new Date(offer.endsAt).getTime() - now
  return (
    <li className="flex flex-col gap-3 rounded-card border border-line p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-muted">{storeName}</p>
          <h2 className="font-semibold">{offer.title}</h2>
          <p className="text-sm font-medium text-green">{offer.discountPercent}% OFF</p>
        </div>
        <OfferStatusChip status={overview.status} />
      </div>

      <dl className="grid grid-cols-2 gap-2">
        <div className="flex flex-col-reverse rounded-card bg-surface p-2">
          <dt className="text-xs text-muted">Termina em</dt>
          <dd className="text-xl font-bold tabular-nums">{formatCountdown(msLeft)}</dd>
        </div>
        <div className="flex flex-col-reverse rounded-card bg-surface p-2">
          <dt className="text-xs text-muted">Restantes de {formatCount(overview.releasedQuantity)}</dt>
          <dd className="text-xl font-bold text-green">{formatCount(overview.remaining)}</dd>
        </div>
      </dl>
    </li>
  )
}
