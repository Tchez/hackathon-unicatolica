import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { SimulatedBadge } from '../../../components/SimulatedBadge'
import { useCurrentUser } from '../../account/accountStore'
import { Countdown } from '../../offers/components/Countdown'
import { useNow } from '../../offers/components/useNow'
import { PollOutcome } from '../components/PollOutcome'
import { PollResultList } from '../components/PollResultList'
import { getPollStatus, getResults, useCommunityStore, type VoteError } from '../communityStore'

const VOTE_MESSAGES: Record<VoteError, string> = {
  invalid_user: 'Só visitantes podem votar. Entre com um usuário visitante.',
  poll_not_found: 'Esta votação não existe mais.',
  invalid_option: 'Escolha uma das opções.',
  closed: 'A votação foi encerrada.',
  already_voted: 'Você já votou nesta votação.',
}

/** Votação da programação do shopping: escolher e confirmar, depois ver o resultado. */
export function PollPage() {
  const user = useCurrentUser()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const poll = useCommunityStore((state) => state.polls[0])
  const votes = useCommunityStore((state) => state.votes)
  const vote = useCommunityStore((state) => state.vote)
  const now = useNow()
  const [selected, setSelected] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  if (!poll) {
    return (
      <section className="mx-auto w-full max-w-xl px-4 py-6">
        <h1 className="text-xl font-semibold">Votação não encontrada</h1>
        <p className="mt-2 text-muted">Restaure os dados de demonstração pelo perfil.</p>
      </section>
    )
  }

  const closed = getPollStatus(poll, now) === 'closed'
  const results = getResults(poll, votes)
  const myVote = user ? votes.find((item) => item.pollId === poll.id && item.userId === user.id) : undefined

  function handleConfirm() {
    if (!poll) return
    if (!user) {
      // Sem conta: o /login convida a criar conta e volta para a votação.
      navigate('/login', { state: { from: pathname, reason: 'vote' } })
      return
    }
    if (!selected) {
      setError(VOTE_MESSAGES.invalid_option)
      return
    }
    const result = vote(user.id, poll.id, selected)
    setError(result.ok ? null : VOTE_MESSAGES[result.error])
  }

  const showResults = closed || myVote !== undefined

  return (
    <section className="mx-auto w-full max-w-xl px-4 py-4 lg:py-6">
      <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-gold-dark">
        Você decide a programação <SimulatedBadge />
      </p>
      <h1 className="mt-1 text-xl font-semibold">{poll.question}</h1>
      <p className="mt-2 text-sm text-muted">
        {closed ? (
          'Votação encerrada.'
        ) : (
          <>
            Termina em <Countdown endsAt={poll.closesAt} className="font-semibold text-text" />
          </>
        )}
      </p>

      <div className="mt-4 flex flex-col gap-4">
        {closed && <PollOutcome poll={poll} results={results} />}

        {showResults ? (
          <>
            <PollResultList results={results} myOptionId={myVote?.optionId} />
            <p className="text-sm text-muted">
              {results.total} {results.total === 1 ? 'voto' : 'votos'} no total. Votos de outros visitantes
              são simulados.
            </p>
          </>
        ) : (
          <>
            <fieldset className="flex flex-col gap-2">
              <legend className="sr-only">Opções</legend>
              {poll.options.map((option) => (
                <label
                  key={option.id}
                  className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-card border p-3 ${
                    selected === option.id ? 'border-primary bg-primary-soft' : 'border-line'
                  }`}
                >
                  <input
                    type="radio"
                    name="poll-option"
                    value={option.id}
                    checked={selected === option.id}
                    onChange={() => setSelected(option.id)}
                    className="size-5 accent-primary"
                  />
                  {option.label}
                </label>
              ))}
            </fieldset>
            {error && (
              <p role="alert" className="rounded-card bg-primary-soft p-3 text-sm text-primary-dark">
                {error}
              </p>
            )}
            <button
              type="button"
              onClick={handleConfirm}
              disabled={user !== undefined && !selected}
              className="min-h-12 w-full rounded-card bg-primary px-4 font-semibold text-white disabled:opacity-50"
            >
              {user ? 'Confirmar voto' : 'Entrar para votar'}
            </button>
            <p className="text-center text-[13px] text-muted">
              Um voto por pessoa{user ? '' : ' · exige conta'}
            </p>
          </>
        )}
      </div>
    </section>
  )
}
