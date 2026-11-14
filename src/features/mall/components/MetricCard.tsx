import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

interface MetricCardProps {
  label: string
  value: string
  icon: LucideIcon
  /** Classes de cor do quadrado do ícone (fundo suave e ícone), do tema. */
  tone: string
  /** Selo ao lado do rótulo, quando o número depende de algo simulado. */
  badge?: ReactNode
}

/** Cartão de um número agregado do painel: sem nome, código ou qualquer dado de pessoa (RNF05). */
export function MetricCard({ label, value, icon: Icon, tone, badge }: MetricCardProps) {
  return (
    <li className="flex items-center gap-4 rounded-card bg-surface p-4">
      <span className={`flex size-12 shrink-0 items-center justify-center rounded-card ${tone}`}>
        <Icon aria-hidden className="size-6" />
      </span>
      <div className="min-w-0">
        <p className="text-2xl font-bold leading-tight">{value}</p>
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
          {label}
          {badge}
        </p>
      </div>
    </li>
  )
}
