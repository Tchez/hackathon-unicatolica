import { useState } from 'react'
import { SimulatedBadge } from '../../../components/SimulatedBadge'
import { getPollStatus, getResults, useCommunityStore } from '../../community/communityStore'
import { formatCount } from '../mallFormat'

interface PollResultsCardProps {
  /** Relógio real da tela. */
  now: number
  /** Chamado depois de encerrar, para a tela atualizar o relógio. */
  onClosed: () => void
}

/** Votação da programação no painel: só totais por opção, sem nomes (RNF05), e "Encerrar votação". */
export function PollResultsCard({ now, onClosed }: PollResultsCardProps) {
  const poll = useCommunityStore((state) => state.polls[0])
  const votes = useCommunityStore((state) => state.votes)
  const closePoll = useCommunityStore((state) => state.closePoll)
  const [confirming, setConfirming] = useState(false)

  if (!poll) return null
  const closed = getPollStatus(poll, now) === 'closed'
  const results = getResults(poll, votes)

  return (
    <article
      aria-labelledby="mall-poll-title"
      className="flex flex-col gap-4 rounded-card border border-line p-4"
    >
      <header>
        <p className="text-sm text-muted">Votação da programação</p>
        <h3 id="mall-poll-title" className="font-semibold">
          {poll.question}
        </h3>
        <p className="mt-1 text-sm text-muted">
          {formatCount(results.total)} {results.total === 1 ? 'voto' : 'votos'} ·{' '}
          {closed ? 'encerrada' : 'aberta'}
        </p>
      </header>

      <ul className="flex flex-col gap-2 text-sm">
        {results.options.map((option) => (
          <li
            key={option.optionId}
            className="flex items-center justify-between gap-3 rounded-card bg-surface p-3"
          >
            <span>{option.label}</span>
            <span className="shrink-0 font-bold tabular-nums">
              {formatCount(option.count)} ({option.percent}%)
            </span>
          </li>
        ))}
      </ul>

      <p className="flex flex-wrap items-center gap-2 text-sm text-muted">
        Só totais, sem nomes. <SimulatedBadge />
      </p>

      {confirming ? (
        <div className="flex flex-col gap-3 rounded-card bg-primary-soft p-4">
          <p className="text-sm">Encerrar agora? Ninguém mais vota e o visitante vê a opção vencedora.</p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                closePoll(poll.id)
                setConfirming(false)
                onClosed()
              }}
              className="min-h-12 flex-1 rounded-card bg-primary px-4 font-medium text-white"
            >
              Confirmar encerramento
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="min-h-12 flex-1 rounded-card border border-line bg-background px-4 font-medium"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          disabled={closed}
          className="mt-auto min-h-12 rounded-card bg-primary px-4 font-medium text-white disabled:opacity-50"
        >
          {closed ? 'Votação encerrada' : 'Encerrar votação'}
        </button>
      )}
    </article>
  )
}
