import { Check } from 'lucide-react'
import type { PollResults } from '../communityStore'

interface PollResultListProps {
  results: PollResults
  /** Opção em que a pessoa votou, quando é visitante logado e já votou. */
  myOptionId?: string
}

/** Porcentagem e total de votos por opção, com "Seu voto" na escolhida. */
export function PollResultList({ results, myOptionId }: PollResultListProps) {
  return (
    <ul className="flex flex-col gap-3">
      {results.options.map((option) => (
        <li key={option.optionId} className="rounded-card border border-line p-3">
          <div className="flex items-start justify-between gap-3">
            <p className="font-medium">{option.label}</p>
            <p className="shrink-0 text-lg font-bold tabular-nums text-primary">{option.percent}%</p>
          </div>
          <div aria-hidden className="mt-2 h-2 overflow-hidden rounded-card bg-surface">
            <div className="h-full bg-gold" style={{ width: `${option.percent}%` }} />
          </div>
          <p className="mt-2 flex flex-wrap items-center gap-x-3 text-sm text-muted">
            {option.count} {option.count === 1 ? 'voto' : 'votos'}
            {option.optionId === myOptionId && (
              <span className="inline-flex items-center gap-1 font-semibold text-green">
                <Check aria-hidden className="size-4" /> Seu voto
              </span>
            )}
          </p>
        </li>
      ))}
    </ul>
  )
}
