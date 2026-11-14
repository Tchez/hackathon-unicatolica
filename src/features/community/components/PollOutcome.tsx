import type { Poll } from '../../../types'
import type { PollResults } from '../communityStore'

interface PollOutcomeProps {
  poll: Poll
  results: PollResults
}

/** Resultado de uma votação encerrada: vencedora anunciada ou empate. */
export function PollOutcome({ poll, results }: PollOutcomeProps) {
  const labels = results.winnerIds.map((id) => poll.options.find((option) => option.id === id)?.label ?? '')
  let message: string
  if (labels.length === 0) message = 'Votação encerrada sem votos.'
  else if (labels.length === 1)
    message = `Vencedora: ${labels[0]}. A transmissão é no domingo, na Arena Capim.`
  else message = `Empate entre ${labels.join(' e ')}. O shopping decide o desempate.`
  return (
    <p role="status" className="rounded-card bg-green-soft p-3 text-sm font-semibold text-green">
      {message}
    </p>
  )
}
