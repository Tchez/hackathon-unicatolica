import { beforeEach, describe, expect, it } from 'vitest'
import { useAccountStore } from '../account/accountStore'
import { useReferralStore } from '../referral/referralStore'
import { usePointsStore } from './pointsStore'

const points = () => usePointsStore.getState()

function newCode(userId: string, now = Date.now()): string {
  const result = points().generatePurchaseCode(userId, now)
  if (!result.ok) throw new Error('código não gerado')
  return result.value.code
}

beforeEach(() => {
  useAccountStore.getState().restoreDemoData()
})

describe('dados iniciais', () => {
  it('Bruno começa com 420 pontos e Ana com 0', () => {
    expect(points().getBalance('user-bruno')).toBe(420)
    expect(points().getBalance('user-ana')).toBe(0)
  })
})

describe('generatePurchaseCode', () => {
  it('só gera para visitante', () => {
    expect(points().generatePurchaseCode('user-techplay')).toEqual({ ok: false, error: 'invalid_user' })
    expect(points().generatePurchaseCode('user-ana').ok).toBe(true)
  })
})

describe('confirmPurchase', () => {
  it('cria compra e pontos e marca o código como usado', () => {
    const code = newCode('user-ana')
    const result = points().confirmPurchase('store-techplay', code, 25_000)
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.value.pointsEarned).toBe(25)
    expect(result.value.purchase).toMatchObject({
      userId: 'user-ana',
      storeId: 'store-techplay',
      amountCents: 25_000,
    })
    expect(points().getBalance('user-ana')).toBe(25)
    expect(points().confirmPurchase('store-techplay', code, 25_000)).toEqual({ ok: false, error: 'used' })
  })

  it('recusa código inexistente e vencido', () => {
    expect(points().confirmPurchase('store-techplay', '000000', 1000)).toEqual({
      ok: false,
      error: 'not_found',
    })
    const now = Date.now()
    const code = newCode('user-ana', now)
    const late = now + 10 * 60_000
    expect(points().confirmPurchase('store-techplay', code, 1000, late)).toEqual({
      ok: false,
      error: 'expired',
    })
    expect(points().purchases.some((p) => p.userId === 'user-ana')).toBe(false)
  })

  it('recusa valor inválido e loja inexistente sem gastar o código', () => {
    const code = newCode('user-ana')
    expect(points().confirmPurchase('store-techplay', code, 0)).toEqual({
      ok: false,
      error: 'invalid_amount',
    })
    expect(points().confirmPurchase('store-x', code, 1000)).toEqual({ ok: false, error: 'store_not_found' })
    expect(points().confirmPurchase('store-techplay', code, 1000).ok).toBe(true)
  })

  it('credita o bônus de indicação aos dois lados uma única vez, na primeira compra do indicado', () => {
    // Ana cria a conta com o código do Bruno (J6).
    expect(useReferralStore.getState().registerWithCode('user-ana', 'bruno100').ok).toBe(true)
    const first = points().confirmPurchase('store-techplay', newCode('user-ana'), 30_000)
    expect(first.ok && first.value.referralEntries).toHaveLength(2)
    expect(points().getBalance('user-ana')).toBe(30 + 100)
    expect(points().getBalance('user-bruno')).toBe(420 + 100)

    points().confirmPurchase('store-techplay', newCode('user-ana'), 30_000)
    expect(points().getBalance('user-ana')).toBe(30 + 100 + 30)
    expect(points().getBalance('user-bruno')).toBe(520)
  })
})

describe('redeemReward', () => {
  function giveBruno(extraPoints: number): void {
    usePointsStore.setState((state) => ({
      entries: [
        ...state.entries,
        {
          id: 'extra',
          userId: 'user-bruno',
          points: extraPoints,
          reason: 'purchase',
          refId: 'x',
          createdAt: new Date().toISOString(),
        },
      ],
    }))
  }

  it('troca pontos por cupom e lança o movimento negativo', () => {
    giveBruno(180) // 600 pontos
    const result = points().redeemReward('user-bruno', 'reward-parking-2h')
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.value).toMatchObject({ source: 'reward', sourceId: 'reward-parking-2h', status: 'active' })
    expect(points().getBalance('user-bruno')).toBe(100)
    expect(points().entries.at(-1)).toMatchObject({
      points: -500,
      reason: 'redemption',
      refId: result.value.id,
    })
  })

  it('respeita o limite por recompensa', () => {
    giveBruno(1000)
    expect(points().redeemReward('user-bruno', 'reward-parking-2h').ok).toBe(true)
    expect(points().redeemReward('user-bruno', 'reward-parking-2h')).toEqual({
      ok: false,
      error: 'limit_reached',
    })
    expect(points().redeemReward('user-bruno', 'reward-discount-10').ok).toBe(true)
  })

  it('recusa saldo insuficiente sem mexer nos pontos', () => {
    expect(points().redeemReward('user-bruno', 'reward-discount-10')).toEqual({
      ok: false,
      error: 'insufficient_points',
    })
    expect(points().getBalance('user-bruno')).toBe(420)
    expect(points().redeemReward('user-ana', 'reward-discount-25')).toEqual({
      ok: false,
      error: 'insufficient_points',
    })
  })

  it('recusa recompensa inexistente e usuário que não é visitante', () => {
    expect(points().redeemReward('user-bruno', 'x')).toEqual({ ok: false, error: 'reward_not_found' })
    expect(points().redeemReward('user-mall', 'reward-discount-10')).toEqual({
      ok: false,
      error: 'invalid_user',
    })
  })
})
