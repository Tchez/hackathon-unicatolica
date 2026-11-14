import type { OfferStatus } from '../../../lib/offers'
import { STATUS_LABELS } from './offerView'

const TONES: Record<OfferStatus, string> = {
  live: 'bg-green-soft text-green',
  upcoming: 'bg-gold-soft text-gold-dark',
  sold_out: 'bg-brown-soft text-brown',
  ended: 'bg-surface text-muted',
}

interface StatusChipProps {
  status: OfferStatus
}

/** Estado da oferta: liberada, em breve, esgotada ou encerrada. */
export function StatusChip({ status }: StatusChipProps) {
  return (
    <span className={`inline-flex rounded-md px-2 py-0.5 text-xs font-semibold ${TONES[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  )
}
