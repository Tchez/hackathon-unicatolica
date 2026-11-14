import { useRef, useState } from 'react'
import { SimulatedBadge } from '../../../components/SimulatedBadge'
import { formatDate } from '../../../lib/format'
import type { Offer } from '../../../types'
import { useOffersStore, type OfferActionError } from '../../offers/offersStore'
import { describeNoticeSent, formatCount, pluralize } from '../mallFormat'
import { getOfferBatchOverview } from '../mallOffers'
import { OfferStatusChip } from './OfferStatusChip'
import { ReleaseBatchPanel } from './ReleaseBatchPanel'

const formatTime = (ms: number) =>
  new Date(ms).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

const RELEASE_ERRORS: Record<OfferActionError, string> = {
  offer_not_found: 'Oferta não encontrada. Recarregue o painel e tente de novo.',
  ended: 'A oferta já foi encerrada; não é possível liberar lote.',
  invalid_quantity: 'Informe um número inteiro maior que zero.',
}

interface OfferReleaseCardProps {
  offer: Offer
  storeName: string
  /** Relógio real da tela. */
  now: number
  /** Chamado depois de liberar, para a tela atualizar o relógio e já mostrar o lote como liberado. */
  onReleased: () => void
}

interface Feedback {
  quantity: number
  presentCount: number
  releasedAt: number
}

/** Oferta da campanha com lotes liberados e restantes e o botão "Liberar lote agora". */
export function OfferReleaseCard({ offer, storeName, now, onReleased }: OfferReleaseCardProps) {
  const releaseBatch = useOffersStore((state) => state.releaseBatch)
  const presentCount = useOffersStore((state) => state.presentUserIds.length)
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const [feedback, setFeedback] = useState<Feedback | undefined>()
  const triggerRef = useRef<HTMLButtonElement>(null)

  const overview = getOfferBatchOverview(offer, now)
  const ended = overview.status === 'ended'
  const progress =
    overview.releasedQuantity > 0 ? Math.min(100, (overview.redeemed / overview.releasedQuantity) * 100) : 0
  const titleId = `mall-offer-${offer.id}`

  const close = () => {
    setOpen(false)
    setError(undefined)
    triggerRef.current?.focus()
  }

  const confirm = (quantity: number) => {
    const result = releaseBatch(offer.id, quantity)
    if (!result.ok) {
      setError(RELEASE_ERRORS[result.error])
      return
    }
    setFeedback({ quantity, presentCount, releasedAt: Date.now() })
    onReleased()
    close()
  }

  return (
    <article aria-labelledby={titleId} className="flex flex-col gap-4 rounded-card border border-line p-4">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-muted">{storeName}</p>
          <h3 id={titleId} className="font-semibold">
            {offer.title}
          </h3>
          <p className="text-sm font-medium text-primary">{offer.discountPercent}% OFF</p>
        </div>
        <OfferStatusChip status={overview.status} />
      </header>

      <dl className="grid grid-cols-3 gap-2 text-center">
        <div className="flex flex-col-reverse rounded-card bg-surface p-2">
          <dt className="text-xs text-muted">Liberadas</dt>
          <dd className="text-xl font-bold">{formatCount(overview.releasedQuantity)}</dd>
        </div>
        <div className="flex flex-col-reverse rounded-card bg-surface p-2">
          <dt className="text-xs text-muted">Resgatadas</dt>
          <dd className="text-xl font-bold">{formatCount(overview.redeemed)}</dd>
        </div>
        <div className="flex flex-col-reverse rounded-card bg-surface p-2">
          <dt className="text-xs text-muted">Restantes</dt>
          <dd className="text-xl font-bold text-green">{formatCount(overview.remaining)}</dd>
        </div>
      </dl>

      <div aria-hidden className="h-2 overflow-hidden rounded-card bg-surface">
        <div className="h-full bg-gold" style={{ width: `${progress}%` }} />
      </div>

      <div>
        <h4 className="mb-2 text-sm font-semibold">
          {overview.batches.length === 0
            ? 'Lotes'
            : `Lotes · ${overview.releasedBatches} de ${overview.batches.length} ${pluralize(overview.batches.length, 'liberado', 'liberados')}`}
        </h4>
        {overview.batches.length === 0 ? (
          <p className="text-sm text-muted">
            Nenhum lote liberado ainda. O lote sai por “Liberar lote agora”.
          </p>
        ) : (
          <ul className="flex flex-col gap-1.5 text-sm">
            {overview.batches.map((batch) => (
              <li key={batch.position} className="flex flex-wrap items-center justify-between gap-x-3">
                <span>
                  Lote {batch.position} · {formatCount(batch.quantity)}{' '}
                  {pluralize(batch.quantity, 'unidade', 'unidades')}
                </span>
                <span className={batch.released ? 'text-green' : 'text-gold-dark'}>
                  {batch.released ? 'Liberado' : 'Programado'} {formatDate(batch.releaseAt, true)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          setFeedback(undefined)
          setOpen(true)
        }}
        disabled={ended}
        aria-expanded={open}
        className="min-h-12 rounded-card bg-primary px-4 font-medium text-white disabled:opacity-50"
      >
        {ended ? 'Oferta encerrada' : 'Liberar lote agora'}
      </button>

      {open && (
        <ReleaseBatchPanel
          offerTitle={offer.title}
          presentCount={presentCount}
          error={error}
          onConfirm={confirm}
          onCancel={close}
        />
      )}

      <div role="status">
        {feedback && (
          <p className="rounded-card bg-green-soft p-3 text-sm font-medium text-green">
            Lote de {formatCount(feedback.quantity)} {pluralize(feedback.quantity, 'unidade', 'unidades')}{' '}
            liberado às {formatTime(feedback.releasedAt)}. {describeNoticeSent(feedback.presentCount)}{' '}
            <SimulatedBadge />
          </p>
        )}
      </div>
    </article>
  )
}
