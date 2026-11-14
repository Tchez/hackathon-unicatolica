import { CircleAlert, CircleCheck, Info } from 'lucide-react'
import type { ConfirmOutcome } from './confirmPurchase'

interface OutcomeMessageProps {
  /** Resultado da última confirmação; sem ele, mostra a espera pelo código. */
  outcome?: ConfirmOutcome
}

/**
 * Resultado da confirmação, num aviso sempre presente na tela (leitores de tela anunciam a troca):
 * verde no sucesso, ferrugem na recusa, dourado enquanto espera o código.
 */
export function OutcomeMessage({ outcome }: OutcomeMessageProps) {
  const tone = !outcome
    ? { box: 'bg-gold-soft text-text', Icon: Info }
    : outcome.ok
      ? { box: 'bg-green text-white', Icon: CircleCheck }
      : { box: 'bg-primary-soft text-primary-dark', Icon: CircleAlert }

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex items-start gap-2.5 rounded-card p-3.5 ${tone.box}`}
    >
      <tone.Icon aria-hidden className="mt-px size-5 flex-none" />
      <div className="min-w-0 flex-1 leading-snug">
        <p className="font-semibold">{outcome ? outcome.title : 'Aguardando o código do cliente'}</p>
        {outcome?.detail && <p className="mt-0.5 text-sm">{outcome.detail}</p>}
      </div>
    </div>
  )
}
