import { Zap } from 'lucide-react'
import { OfferStateChip } from './OfferStateChip'
import { remainingLabel } from './labels'
import { shortDuration } from './flashOffer'

interface OfferPreviewCardProps {
  title: string
  storeName: string
  discountPercent: number
  durationMinutes: number
  quantity: number
}

/** Prévia do formulário: o card da oferta relâmpago como o visitante o verá, recém-publicada. */
export function OfferPreviewCard({
  title,
  storeName,
  discountPercent,
  durationMinutes,
  quantity,
}: OfferPreviewCardProps) {
  const product = title.trim()
  return (
    <div className="flex items-center gap-3 rounded-card border border-line p-3">
      <span className="flex size-13 flex-none items-center justify-center rounded-full bg-surface text-primary">
        <Zap aria-hidden className="size-6" />
      </span>
      <div className="min-w-0 flex-1">
        <p className={`font-semibold break-words ${product ? '' : 'text-muted'}`}>
          {product || 'Produto'} · {discountPercent}% OFF
        </p>
        <p className="text-sm text-muted">{storeName}</p>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <OfferStateChip status="live" />
          <span className="rounded-md bg-surface px-2 py-0.5 text-xs font-semibold text-primary">
            Termina em {shortDuration(durationMinutes)}
          </span>
          <span className="rounded-md bg-surface px-2 py-0.5 text-xs text-muted">
            {remainingLabel(quantity)}
          </span>
        </div>
      </div>
    </div>
  )
}
