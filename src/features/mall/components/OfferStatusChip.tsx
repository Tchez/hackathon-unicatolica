import type { OfferStatus } from '../../../lib/offers'

const STATUS: Record<OfferStatus, { label: string; tone: string }> = {
  live: { label: 'Liberada', tone: 'bg-green-soft text-green' },
  upcoming: { label: 'Em breve', tone: 'bg-gold-soft text-gold-dark' },
  sold_out: { label: 'Esgotada', tone: 'bg-primary-soft text-primary' },
  ended: { label: 'Encerrada', tone: 'bg-surface text-muted' },
}

interface OfferStatusChipProps {
  status: OfferStatus
}

/** Estado da oferta em texto e cor do tema: liberada, em breve, esgotada ou encerrada. */
export function OfferStatusChip({ status }: OfferStatusChipProps) {
  const { label, tone } = STATUS[status]
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-card px-2 py-0.5 text-xs font-semibold ${tone}`}
    >
      {label}
    </span>
  )
}
