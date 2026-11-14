import { beforeEach, describe, expect, it } from 'vitest'
import { REWARDS } from '../../../config/business-rules'
import type { Coupon, PurchaseCode, Reward } from '../../../types'
import { useAccountStore } from '../../account/accountStore'
import { usePointsStore } from '../pointsStore'
import {
  buildStatement,
  countRedeemed,
  formatPurchaseCode,
  formatSignedPoints,
  getCodeStatus,
  getCouponState,
  getLatestCode,
  getProgressSummary,
  getRecentPurchases,
  getRewardAvailability,
  splitCoupons,
} from './pointsView'

const points = () => usePointsStore.getState()
const MINUTE = 60_000
const discount10 = REWARDS.find((reward) => reward.id === 'reward-discount-10') as Reward
const parking = REWARDS.find((reward) => reward.id === 'reward-parking-2h') as Reward

function coupon(overrides: Partial<Coupon>): Coupon {
  return {
    id: 'c',
    userId: 'user-ana',
    source: 'reward',
    sourceId: 'reward-discount-10',
    code: 'ABC234',
    status: 'active',
    createdAt: new Date(0).toISOString(),
    expiresAt: new Date(60 * MINUTE).toISOString(),
    ...overrides,
  }
}

beforeEach(() => {
  useAccountStore.getState().restoreDemoData()
})

describe('formatação', () => {
  it('divide o código ao meio e sinaliza os pontos do extrato', () => {
    expect(formatPurchaseCode('482913')).toBe('482 913')
    expect(formatSignedPoints(18)).toBe('+18')
    expect(formatSignedPoints(-1200)).toBe('−1.200')
  })
})

describe('código de compra', () => {
  it('fica ativo, vence no prazo e vira usado quando o lojista confirma', () => {
    const now = Date.now()
    const generated = points().generatePurchaseCode('user-ana', now)
    if (!generated.ok) throw new Error('código não gerado')
    const code: PurchaseCode = generated.value
    expect(getCodeStatus(code, now)).toBe('active')
    expect(getCodeStatus(code, now + 10 * MINUTE)).toBe('expired')

    // A tela lê o último código do store: a confirmação (de outra aba ou desta) muda o estado.
    points().confirmPurchase('store-techplay', code.code, 25_000, now + MINUTE)
    const latest = getLatestCode(points().purchaseCodes, 'user-ana')
    expect(latest && getCodeStatus(latest, now + MINUTE)).toBe('used')
    expect(getRecentPurchases(points().purchases, points().entries, 'user-ana')[0]).toMatchObject({
      amountCents: 25_000,
      points: 25,
      storeName: 'TechPlay',
    })
  })
})

describe('progresso e recompensas', () => {
  it('Bruno, com 420, vê quanto falta para R$ 10', () => {
    expect(getProgressSummary([], 'user-bruno', 420)).toEqual({
      title: 'Faltam 80 para R$ 10 de desconto',
      goal: 500,
      percent: 84,
    })
  })

  it('a meta pula a recompensa já trocada', () => {
    const coupons = [coupon({ sourceId: 'reward-discount-10' }), coupon({ sourceId: 'reward-parking-2h' })]
    expect(getProgressSummary(coupons, 'user-ana', 600).title).toBe('Faltam 600 para R$ 25 de desconto')
  })

  it('desabilita por limite antes de olhar o saldo, como o store', () => {
    expect(getRewardAvailability(discount10, 1000, 1)).toEqual({ status: 'limit' })
    expect(getRewardAvailability(parking, 420, 0)).toEqual({ status: 'insufficient', missing: 80 })
    expect(getRewardAvailability(parking, 500, 0)).toEqual({ status: 'available' })
  })
})

describe('troca e extrato', () => {
  it('a troca debita os pontos e aparece negativa no extrato', () => {
    const code = points().generatePurchaseCode('user-bruno')
    if (!code.ok) throw new Error('código não gerado')
    points().confirmPurchase('store-techplay', code.value.code, 100_000)
    const redeemed = points().redeemReward('user-bruno', 'reward-parking-2h')
    expect(redeemed.ok).toBe(true)

    const { coupons, entries, purchases } = points()
    expect(countRedeemed(coupons, 'user-bruno', 'reward-parking-2h')).toBe(1)
    const statement = buildStatement(entries, purchases, coupons, 'user-bruno')
    expect(statement[0]).toMatchObject({ description: 'Troca: Estacionamento 2 h', points: -500 })
    expect(statement[1]).toMatchObject({ description: 'Compra na TechPlay', points: 100 })
  })
})

describe('cupons', () => {
  it('separa ativos de usados e vencidos', () => {
    const now = 30 * MINUTE
    const list = [
      coupon({ id: 'ativo' }),
      coupon({ id: 'usado', status: 'used' }),
      coupon({ id: 'vencido', expiresAt: new Date(10 * MINUTE).toISOString() }),
      coupon({ id: 'de-outra-pessoa', userId: 'user-bruno' }),
    ]
    const { active, past } = splitCoupons(list, 'user-ana', now)
    expect(active.map((item) => item.id)).toEqual(['ativo'])
    expect(past.map((item) => getCouponState(item, now))).toEqual(['expired', 'used'])
  })
})
