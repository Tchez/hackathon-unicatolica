interface SimulatedBadgeProps {
  /** "simulation" marca o que não é real; "illustrative" marca regra ainda não decidida. */
  variant?: 'simulation' | 'illustrative'
}

const LABELS = { simulation: 'Simulação', illustrative: 'Valor ilustrativo' } as const

/** Selo ao lado de todo dado ou ação simulada (RNF03). */
export function SimulatedBadge({ variant = 'simulation' }: SimulatedBadgeProps) {
  return (
    <span className="inline-flex items-center rounded-card bg-gold-soft px-2 py-0.5 text-xs font-semibold text-gold-dark">
      {LABELS[variant]}
    </span>
  )
}
