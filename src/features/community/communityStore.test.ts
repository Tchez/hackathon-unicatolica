import { beforeEach, describe, expect, it } from 'vitest'
import { PROGRAMMING_POLL_ID } from '../../data/polls'
import { useAccountStore } from '../account/accountStore'
import { getPollStatus, getResults, useCommunityStore } from './communityStore'

const community = () => useCommunityStore.getState()
const poll = () => community().polls[0]
const results = () => getResults(poll(), community().votes)

beforeEach(() => {
  useAccountStore.getState().restoreDemoData()
})

describe('vote', () => {
  it('registra um voto e conta na opção escolhida', () => {
    const before = results()
    const result = community().vote('user-ana', PROGRAMMING_POLL_ID, 'option-tocantinense')
    expect(result.ok).toBe(true)
    const after = results()
    expect(after.total).toBe(before.total + 1)
    expect(after.options.find((o) => o.optionId === 'option-tocantinense')?.count).toBe(8)
  })

  it('recusa o segundo voto da mesma pessoa, mesmo em outra opção', () => {
    community().vote('user-ana', PROGRAMMING_POLL_ID, 'option-brasileirao')
    expect(community().vote('user-ana', PROGRAMMING_POLL_ID, 'option-tocantinense')).toEqual({
      ok: false,
      error: 'already_voted',
    })
    expect(results().total).toBe(29)
  })

  it('recusa usuário inválido, votação inexistente e opção inválida', () => {
    expect(community().vote('user-mall', PROGRAMMING_POLL_ID, 'option-brasileirao')).toEqual({
      ok: false,
      error: 'invalid_user',
    })
    expect(community().vote('ninguem', PROGRAMMING_POLL_ID, 'option-brasileirao')).toEqual({
      ok: false,
      error: 'invalid_user',
    })
    expect(community().vote('user-ana', 'nada', 'option-brasileirao')).toEqual({
      ok: false,
      error: 'poll_not_found',
    })
    expect(community().vote('user-ana', PROGRAMMING_POLL_ID, 'nada')).toEqual({
      ok: false,
      error: 'invalid_option',
    })
  })

  it('recusa voto depois do prazo', () => {
    const after = new Date(poll().closesAt).getTime() + 1
    expect(getPollStatus(poll(), after)).toBe('closed')
    expect(community().vote('user-ana', PROGRAMMING_POLL_ID, 'option-brasileirao', after)).toEqual({
      ok: false,
      error: 'closed',
    })
  })
})

describe('closePoll', () => {
  it('encerra pelo botão e bloqueia novos votos', () => {
    expect(getPollStatus(poll())).toBe('open')
    const result = community().closePoll(PROGRAMMING_POLL_ID)
    expect(result.ok).toBe(true)
    expect(getPollStatus(poll())).toBe('closed')
    expect(community().vote('user-bruno', PROGRAMMING_POLL_ID, 'option-brasileirao')).toEqual({
      ok: false,
      error: 'closed',
    })
  })

  it('devolve erro para votação inexistente', () => {
    expect(community().closePoll('nada')).toEqual({ ok: false, error: 'poll_not_found' })
  })
})

describe('getResults', () => {
  it('calcula contagem, porcentagem e vencedora dos votos iniciais', () => {
    const r = results()
    expect(r.total).toBe(28)
    expect(r.options.map((o) => [o.count, o.percent])).toEqual([
      [12, 43],
      [9, 32],
      [7, 25],
    ])
    expect(r.winnerIds).toEqual(['option-brasileirao'])
  })

  it('lista as empatadas', () => {
    community().vote('user-ana', PROGRAMMING_POLL_ID, 'option-copa-do-brasil')
    community().vote('user-bruno', PROGRAMMING_POLL_ID, 'option-copa-do-brasil')
    community().vote('user-carla', PROGRAMMING_POLL_ID, 'option-copa-do-brasil')
    expect(results().options.map((o) => o.count)).toEqual([12, 12, 7])
    expect(results().winnerIds).toEqual(['option-brasileirao', 'option-copa-do-brasil'])
  })

  it('não tem vencedora sem votos', () => {
    expect(getResults(poll(), []).winnerIds).toEqual([])
  })

  it('os votos simulados não usam ids dos usuários de exemplo', () => {
    const exampleIds = useAccountStore.getState().users.map((user) => user.id)
    expect(community().votes.some((vote) => exampleIds.includes(vote.userId))).toBe(false)
  })
})
