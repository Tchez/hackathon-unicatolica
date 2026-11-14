import { useId } from 'react'
import { SimulatedBadge } from '../../../components/SimulatedBadge'
import { useMarketingConsent, useMarketingConsentStore } from './marketingConsentStore'

interface MarketingConsentProps {
  userId: string
}

/** Consentimento de marketing, separado do uso do app e desligado por padrão (RNF05). */
export function MarketingConsent({ userId }: MarketingConsentProps) {
  const consented = useMarketingConsent(userId)
  const setMarketing = useMarketingConsentStore((state) => state.setMarketing)
  const labelId = useId()
  const descriptionId = useId()

  return (
    <div className="flex items-center gap-3 rounded-card border border-line p-4">
      <div className="flex-1">
        <p id={labelId} className="font-medium">
          Receber ofertas e novidades
        </p>
        <p id={descriptionId} className="mt-0.5 text-sm text-muted">
          Marketing, separado do uso do app. Opcional: o app funciona igual sem isso.
        </p>
        <p className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted">
          <SimulatedBadge /> Nenhuma mensagem é enviada no protótipo.
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={consented}
        aria-labelledby={labelId}
        aria-describedby={descriptionId}
        onClick={() => setMarketing(userId, !consented)}
        className="flex min-h-12 min-w-14 shrink-0 items-center justify-center"
      >
        <span
          aria-hidden
          className={`relative h-7 w-12 rounded-full transition-colors ${consented ? 'bg-primary' : 'bg-muted/50'}`}
        >
          <span
            className={`absolute top-0.5 left-0.5 size-6 rounded-full bg-background transition-transform ${consented ? 'translate-x-5' : ''}`}
          />
        </span>
      </button>
    </div>
  )
}
