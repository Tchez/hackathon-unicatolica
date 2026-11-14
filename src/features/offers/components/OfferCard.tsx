import { ChevronRight } from 'lucide-react'
import { remainingLabel } from './merchant/labels'
import { Link } from 'react-router'
import { getOfferStatus, getRemaining, useOffersStore } from '../offersStore'
import type { Offer } from '../../../types'
import { Countdown } from './Countdown'
import { offerHeadline } from './offerView'
import { StatusChip } from './StatusChip'
import { getStoreVisual } from './storeVisual'
import { useNow } from './useNow'

interface OfferCardProps {
  offer: Offer
}

const CHIP = 'inline-flex rounded-md bg-surface px-2 py-0.5 text-xs text-text'

/** Linha de oferta: loja, título com desconto, estado, restantes e contagem; leva ao detalhe. */
export function OfferCard({ offer }: OfferCardProps) {
  const store = useOffersStore((state) => state.stores.find((item) => item.id === offer.storeId))
  const now = useNow()
  const status = getOfferStatus(offer, now)
  const { icon: Icon, tone } = getStoreVisual(store)

  return (
    <Link
      to={`/visitor/offers/${offer.id}`}
      className="flex min-h-18 items-center gap-3 border-b border-line py-3"
    >
      <span className={`flex size-13 flex-none items-center justify-center rounded-full ${tone}`}>
        <Icon aria-hidden className="size-6" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-semibold">{offerHeadline(offer)}</span>
        <span className="block text-[13px] text-muted">{store?.name}</span>
        <span className="mt-1 flex flex-wrap items-center gap-1.5">
          <StatusChip status={status} />
          {status === 'live' && (
            <>
              <span className={CHIP}>{remainingLabel(getRemaining(offer, now))}</span>
              <span className="inline-flex rounded-md bg-primary-soft px-2 py-0.5 text-xs font-semibold text-primary">
                Termina em <Countdown endsAt={offer.endsAt} className="ml-1" />
              </span>
            </>
          )}
          {status === 'upcoming' && <span className={CHIP}>Lote surpresa</span>}
        </span>
      </span>
      <ChevronRight aria-hidden className="size-5 flex-none text-muted" />
    </Link>
  )
}
