import { describe, expect, it } from 'vitest'
import type { Offer, PointsEntry, Purchase } from '../../types'
import { computeMallMetrics } from './mallMetrics'

const offer = (id: string, redeemedCount: number, campaignId?: string): Offer => ({
  id,
  storeId: 'store-techplay',
  campaignId,
  title: id,
  discountPercent: 10,
  batches: [],
  endsAt: new Date().toISOString(),
  redeemedCount,
})

const purchase = (id: string, userId: string, amountCents: number): Purchase => ({
  id,
  userId,
  storeId: 'store-techplay',
  purchaseCode: '123456',
  amountCents,
  createdAt: new Date().toISOString(),
})

const entry = (id: string, userId: string, points: number, reason: PointsEntry['reason']): PointsEntry => ({
  id,
  userId,
  points,
  reason,
  refId: id,
  createdAt: new Date().toISOString(),
})

describe('computeMallMetrics', () => {
  it('soma cupons resgatados nas ofertas de campanha e nas relâmpago', () => {
    const metrics = computeMallMetrics({
      offers: [offer('a', 12, 'campaign-1'), offer('b', 8, 'campaign-1'), offer('c', 1)],
      purchases: [],
      entries: [],
      presentUserIds: [],
    })
    expect(metrics.couponsRedeemed).toBe(21)
  })

  it('conta compras comprovadas e soma o valor em centavos', () => {
    const metrics = computeMallMetrics({
      offers: [],
      purchases: [purchase('p1', 'u1', 150_000), purchase('p2', 'u2', 90_000)],
      entries: [],
      presentUserIds: [],
    })
    expect(metrics.purchasesCount).toBe(2)
    expect(metrics.totalPurchasedCents).toBe(240_000)
  })

  it('separa pontos gerados (positivos) de pontos trocados (negativos, em valor positivo)', () => {
    const metrics = computeMallMetrics({
      offers: [],
      purchases: [],
      entries: [
        entry('e1', 'u1', 150, 'purchase'),
        entry('e2', 'u1', 100, 'referral'),
        entry('e3', 'u2', 80, 'purchase'),
        entry('e4', 'u1', -500, 'redemption'),
      ],
      presentUserIds: [],
    })
    expect(metrics.pointsGenerated).toBe(330)
    expect(metrics.pointsExchanged).toBe(500)
  })

  it('conta os visitantes presentes sem expor quem são', () => {
    const metrics = computeMallMetrics({
      offers: [],
      purchases: [],
      entries: [],
      presentUserIds: ['u1', 'u2', 'u3'],
    })
    expect(metrics.presentVisitors).toBe(3)
  })

  it('devolve zeros sem dados', () => {
    expect(computeMallMetrics({ offers: [], purchases: [], entries: [], presentUserIds: [] })).toEqual({
      couponsRedeemed: 0,
      purchasesCount: 0,
      totalPurchasedCents: 0,
      pointsGenerated: 0,
      pointsExchanged: 0,
      presentVisitors: 0,
    })
  })

  it('só devolve números, nunca dados de pessoas (RNF05)', () => {
    const metrics = computeMallMetrics({
      offers: [offer('a', 3)],
      purchases: [purchase('p1', 'user-bruno', 100_000)],
      entries: [entry('e1', 'user-bruno', 100, 'purchase')],
      presentUserIds: ['user-bruno'],
    })
    for (const value of Object.values(metrics)) expect(typeof value).toBe('number')
    expect(JSON.stringify(metrics)).not.toContain('bruno')
  })
})
