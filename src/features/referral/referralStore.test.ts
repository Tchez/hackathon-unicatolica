import { beforeEach, describe, expect, it } from 'vitest'
import { getUser, useAccountStore } from '../account/accountStore'
import { useReferralStore } from './referralStore'

const referral = () => useReferralStore.getState()

beforeEach(() => {
  useAccountStore.getState().restoreDemoData()
})

describe('registerWithCode', () => {
  it('cria indicação pendente e marca quem indicou, ignorando caixa e espaços', () => {
    const result = referral().registerWithCode('user-ana', ' bruno100 ')
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.value).toMatchObject({
      referrerId: 'user-bruno',
      referredId: 'user-ana',
      status: 'pending',
    })
    expect(getUser('user-ana')?.referredBy).toBe('user-bruno')
  })

  it('recusa código inexistente, o próprio código e segunda indicação', () => {
    expect(referral().registerWithCode('user-ana', 'NADA')).toEqual({ ok: false, error: 'invalid_code' })
    expect(referral().registerWithCode('user-ana', 'ANA100')).toEqual({ ok: false, error: 'self_referral' })
    expect(referral().registerWithCode('user-ana', 'BRUNO100').ok).toBe(true)
    expect(referral().registerWithCode('user-ana', 'CARLA100')).toEqual({
      ok: false,
      error: 'already_referred',
    })
    expect(referral().registerWithCode('user-carla', 'ANA100')).toEqual({
      ok: false,
      error: 'already_referred',
    })
  })
})

describe('creditFirstPurchaseBonus', () => {
  it('devolve o bônus dos dois lados uma única vez', () => {
    referral().registerWithCode('user-ana', 'BRUNO100')
    const bonus = referral().creditFirstPurchaseBonus('user-ana')
    expect(bonus.map((b) => [b.userId, b.points])).toEqual([
      ['user-bruno', 100],
      ['user-ana', 100],
    ])
    expect(referral().creditFirstPurchaseBonus('user-ana')).toEqual([])
  })

  it('não devolve nada para quem não foi indicado', () => {
    expect(referral().creditFirstPurchaseBonus('user-ana')).toEqual([])
  })
})
