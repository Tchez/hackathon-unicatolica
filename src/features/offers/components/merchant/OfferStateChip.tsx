import type { OfferStatus } from '../../../../lib/offers'

const STATES: Record<OfferStatus, { label: string; tone: string }> = {
  live: { label: 'Liberada', tone: 'bg-green-soft text-green' },
  upcoming: { label: 'Em breve', tone: 'bg-gold-soft text-gold-dark' },
  sold_out: { label: 'Esgotada', tone: 'bg-primary-soft text-primary-dark' },
  ended: { label: 'Encerrada', tone: 'bg-surface text-muted' },
}

interface OfferStateChipProps {
  status: OfferStatus
}

/** Estado da oferta em um selo colorido: liberada, em breve, esgotada ou encerrada. */
export function OfferStateChip({ status }: OfferStateChipProps) {
  const { label, tone } = STATES[status]
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${tone}`}>
      {label}
    </span>
  )
}
