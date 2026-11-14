import { ChevronRight, Zap } from 'lucide-react'
import { Link } from 'react-router'
import { formatCountdown } from '../../../../lib/format'
import { getRemaining } from '../../../../lib/offers'
import type { OfferStatus } from '../../../../lib/offers'
import type { Offer } from '../../../../types'
import { offerHeadline } from '../offerView'
import { OfferStateChip } from './OfferStateChip'
import { redeemedLabel, remainingLabel } from './labels'

interface MerchantOfferRowProps {
  offer: Offer
  status: OfferStatus
  now: number
}

const chipClass = 'rounded-md bg-surface px-2 py-0.5 text-xs text-muted'

/** Linha da lista "Suas ofertas": título, estado, resgates, restantes e contagem. */
export function MerchantOfferRow({ offer, status, now }: MerchantOfferRowProps) {
  const remaining = getRemaining(offer, now)
  return (
    <Link
      to={`/merchant/offers/${offer.id}`}
      className="flex min-h-18 items-center gap-3 border-b border-line py-3"
    >
      <span className="flex size-12 flex-none items-center justify-center rounded-full bg-surface text-primary">
        <Zap aria-hidden className="size-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold break-words">{offerHeadline(offer)}</span>
        <span className="mt-1 flex flex-wrap items-center gap-1.5">
          <OfferStateChip status={status} />
          {status === 'upcoming' ? (
            <span className={chipClass}>Lote ainda não liberado</span>
          ) : (
            <>
              <span className={chipClass}>{redeemedLabel(offer.redeemedCount)}</span>
              {status === 'live' && <span className={chipClass}>{remainingLabel(remaining)}</span>}
            </>
          )}
          {status === 'live' && (
            <span className="rounded-md bg-surface px-2 py-0.5 text-xs font-semibold tabular-nums text-primary">
              {formatCountdown(new Date(offer.endsAt).getTime() - now)}
            </span>
          )}
        </span>
      </span>
      <ChevronRight aria-hidden className="size-5 flex-none text-muted" />
    </Link>
  )
}
