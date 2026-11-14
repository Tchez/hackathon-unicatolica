import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createPolls, createPollVotes } from '../../data/polls'
import { localJSONStorage, storageKey } from '../../lib/storage'
import { registerStore } from '../../lib/storeRegistry'
import type { Poll, PollVote, Result } from '../../types'
import { getUser } from '../account/accountStore'

export type VoteError = 'invalid_user' | 'poll_not_found' | 'invalid_option' | 'closed' | 'already_voted'
export type ClosePollError = 'poll_not_found'
export type PollStatus = 'open' | 'closed'

export interface OptionResult {
  optionId: string
  label: string
  count: number
  /** Porcentagem inteira do total de votos (0 sem votos). */
  percent: number
}

export interface PollResults {
  options: OptionResult[]
  total: number
  /** Ids das opções com mais votos; mais de uma é empate; vazio sem votos. */
  winnerIds: string[]
}

interface CommunityState {
  polls: Poll[]
  votes: PollVote[]
  /** Um voto por visitante, enquanto a votação estiver aberta. */
  vote: (userId: string, pollId: string, optionId: string, now?: number) => Result<PollVote, VoteError>
  /** Shopping: encerra a votação antes do prazo. */
  closePoll: (pollId: string, now?: number) => Result<Poll, ClosePollError>
}

/** Aberta até o prazo ou até o shopping encerrar, o que vier primeiro. */
export function getPollStatus(poll: Poll, now: number = Date.now()): PollStatus {
  if (poll.closedAt !== undefined) return 'closed'
  return now >= new Date(poll.closesAt).getTime() ? 'closed' : 'open'
}

export function getResults(poll: Poll, votes: PollVote[]): PollResults {
  const mine = votes.filter((vote) => vote.pollId === poll.id)
  const total = mine.length
  const counts = poll.options.map((option) => ({
    option,
    count: mine.filter((vote) => vote.optionId === option.id).length,
  }))
  const max = Math.max(0, ...counts.map((item) => item.count))
  return {
    total,
    options: counts.map(({ option, count }) => ({
      optionId: option.id,
      label: option.label,
      count,
      percent: total === 0 ? 0 : Math.round((count / total) * 100),
    })),
    winnerIds: max === 0 ? [] : counts.filter((item) => item.count === max).map((item) => item.option.id),
  }
}

function initialData(now: number = Date.now()) {
  return { polls: createPolls(now), votes: createPollVotes(now) }
}

export const useCommunityStore = create<CommunityState>()(
  persist(
    (set, get) => ({
      ...initialData(),
      vote: (userId, pollId, optionId, now = Date.now()) => {
        const user = getUser(userId)
        if (user?.role !== 'visitor') return { ok: false, error: 'invalid_user' }
        const poll = get().polls.find((item) => item.id === pollId)
        if (!poll) return { ok: false, error: 'poll_not_found' }
        if (!poll.options.some((option) => option.id === optionId)) {
          return { ok: false, error: 'invalid_option' }
        }
        if (getPollStatus(poll, now) === 'closed') return { ok: false, error: 'closed' }
        if (get().votes.some((item) => item.pollId === pollId && item.userId === userId)) {
          return { ok: false, error: 'already_voted' }
        }
        const vote: PollVote = { pollId, userId, optionId, createdAt: new Date(now).toISOString() }
        set((state) => ({ votes: [...state.votes, vote] }))
        return { ok: true, value: vote }
      },
      closePoll: (pollId, now = Date.now()) => {
        const poll = get().polls.find((item) => item.id === pollId)
        if (!poll) return { ok: false, error: 'poll_not_found' }
        if (getPollStatus(poll, now) === 'closed') return { ok: true, value: poll }
        const closed: Poll = { ...poll, closedAt: new Date(now).toISOString() }
        set((state) => ({ polls: state.polls.map((item) => (item.id === pollId ? closed : item)) }))
        return { ok: true, value: closed }
      },
    }),
    {
      name: storageKey('community'),
      storage: localJSONStorage,
      partialize: (state) => ({ polls: state.polls, votes: state.votes }),
    },
  ),
)

registerStore({
  storageKey: storageKey('community'),
  rehydrate: () => useCommunityStore.persist.rehydrate(),
  reset: () => useCommunityStore.setState(initialData()),
})
