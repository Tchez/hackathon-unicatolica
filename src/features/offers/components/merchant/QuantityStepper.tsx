import { Minus, Plus } from 'lucide-react'
import { useState } from 'react'
import { fieldClass } from './formStyles'
import { clampQuantity, FLASH_OFFER_MAX_QUANTITY, FLASH_OFFER_MIN_QUANTITY } from './flashOffer'

interface QuantityStepperProps {
  id: string
  value: number
  onChange: (value: number) => void
}

const stepButtonClass =
  'flex size-12 flex-none items-center justify-center rounded-card bg-surface text-primary disabled:cursor-not-allowed disabled:opacity-45'

/** Quantidade com − e +, e campo numérico para digitar; sempre entre o mínimo e o máximo. */
export function QuantityStepper({ id, value, onChange }: QuantityStepperProps) {
  // Texto em edição: permite apagar o campo antes de digitar outro número.
  const [draft, setDraft] = useState<string | null>(null)

  const handleInput = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, 4)
    if (digits === '') {
      setDraft('')
      return
    }
    setDraft(null)
    onChange(clampQuantity(Number(digits)))
  }

  return (
    <div role="group" aria-label="Quantidade" className="flex items-center gap-2">
      <button
        type="button"
        aria-label="Diminuir quantidade"
        disabled={value <= FLASH_OFFER_MIN_QUANTITY}
        onClick={() => onChange(clampQuantity(value - 1))}
        className={stepButtonClass}
      >
        <Minus aria-hidden className="size-5" />
      </button>
      <input
        id={id}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        value={draft ?? String(value)}
        onChange={(event) => handleInput(event.target.value)}
        onBlur={() => setDraft(null)}
        className={`${fieldClass} min-w-0 text-center font-semibold tabular-nums`}
      />
      <button
        type="button"
        aria-label="Aumentar quantidade"
        disabled={value >= FLASH_OFFER_MAX_QUANTITY}
        onClick={() => onChange(clampQuantity(value + 1))}
        className={stepButtonClass}
      >
        <Plus aria-hidden className="size-5" />
      </button>
    </div>
  )
}
