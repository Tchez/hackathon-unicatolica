import type { Poll, PollVote } from '../types'

export const PROGRAMMING_POLL_ID = 'poll-programacao'

const HOUR = 3_600_000

// Prazo relativo ao momento da criação dos dados; "Restaurar dados de demonstração" o renova.
export function createPolls(now: number): Poll[] {
  return [
    {
      id: PROGRAMMING_POLL_ID,
      question: 'Qual jogo a Arena Capim transmite no domingo?',
      options: [
        { id: 'option-brasileirao', label: 'Final do Brasileirão' },
        { id: 'option-copa-do-brasil', label: 'Semifinal da Copa do Brasil' },
        { id: 'option-tocantinense', label: 'Final do Campeonato Tocantinense' },
      ],
      closesAt: new Date(now + 24 * HOUR).toISOString(),
    },
  ]
}

// Votos de outros visitantes, fictícios (RNF03): ids próprios, que não coincidem com os usuários de exemplo.
export function createPollVotes(now: number): PollVote[] {
  const counts: Record<string, number> = {
    'option-brasileirao': 12,
    'option-copa-do-brasil': 9,
    'option-tocantinense': 7,
  }
  const createdAt = new Date(now).toISOString()
  const votes: PollVote[] = []
  let voter = 0
  for (const [optionId, count] of Object.entries(counts)) {
    for (let i = 0; i < count; i += 1) {
      voter += 1
      votes.push({ pollId: PROGRAMMING_POLL_ID, userId: `seed-voter-${voter}`, optionId, createdAt })
    }
  }
  return votes
}
