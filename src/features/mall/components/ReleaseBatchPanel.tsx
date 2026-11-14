import { Minus, Plus } from 'lucide-react'
import { useId, useState } from 'react'
import { SimulatedBadge } from '../../../components/SimulatedBadge'
import { MALL_BATCH_DEFAULT_QUANTITY } from '../../../config/business-rules'
import { describeNoticeForecast, pluralize } from '../mallFormat'
import { parseBatchQuantity } from '../mallOffers'

interface ReleaseBatchPanelProps {
  offerTitle: string
  /** Visitantes que marcaram "Estou no shopping" e recebem o aviso (simulação). */
  presentCount: number
  /** Erro devolvido pela ação de liberar, em texto para a tela. */
  error?: string
  onConfirm: (quantity: number) => void
  onCancel: () => void
}

const stepButton =
  'flex size-12 shrink-0 items-center justify-center rounded-card border border-line bg-background disabled:opacity-50'

/** Pede a quantidade do lote (padrão 5) e a confirmação antes de liberar. */
export function ReleaseBatchPanel({
  offerTitle,
  presentCount,
  error,
  onConfirm,
  onCancel,
}: ReleaseBatchPanelProps) {
  const [text, setText] = useState(String(MALL_BATCH_DEFAULT_QUANTITY))
  const inputId = useId()
  const quantity = parseBatchQuantity(text)

  const step = (delta: number) => setText(String(Math.max(1, (quantity ?? 0) + delta)))

  return (
    <form
      aria-label={`Liberar lote de ${offerTitle}`}
      onSubmit={(event) => {
        event.preventDefault()
        if (quantity !== undefined) onConfirm(quantity)
      }}
      className="flex flex-col gap-3 rounded-card bg-primary-soft p-4"
    >
      <label htmlFor={inputId} className="text-sm font-semibold">
        Quantidade de unidades do lote
      </label>
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Diminuir quantidade"
          onClick={() => step(-1)}
          disabled={quantity !== undefined && quantity <= 1}
          className={stepButton}
        >
          <Minus aria-hidden className="size-5" />
        </button>
        <input
          id={inputId}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          autoFocus
          value={text}
          onChange={(event) => setText(event.target.value)}
          aria-invalid={quantity === undefined}
          className="min-h-12 w-24 rounded-card border border-line bg-background px-3 text-center text-lg font-semibold"
        />
        <button type="button" aria-label="Aumentar quantidade" onClick={() => step(1)} className={stepButton}>
          <Plus aria-hidden className="size-5" />
        </button>
      </div>

      {quantity === undefined ? (
        <p role="alert" className="text-sm font-medium text-primary-dark">
          Informe um número inteiro maior que zero.
        </p>
      ) : (
        <p className="text-sm">
          Libera {quantity} {pluralize(quantity, 'unidade', 'unidades')} agora, somando ao que já está
          disponível. {describeNoticeForecast(presentCount)} <SimulatedBadge />
        </p>
      )}

      {error && (
        <p role="alert" className="text-sm font-medium text-primary-dark">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="submit"
          disabled={quantity === undefined}
          className="min-h-12 flex-1 rounded-card bg-primary px-4 font-medium text-white disabled:opacity-50"
        >
          Confirmar liberação
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="min-h-12 flex-1 rounded-card border border-line bg-background px-4 font-medium"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
