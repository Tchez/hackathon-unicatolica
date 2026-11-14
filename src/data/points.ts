import type { Coupon, PointsEntry, Purchase, Referral } from '../types'
import { COFFEE_FLASH_OFFER_ID } from './offers'

const DAY = 86_400_000

// Histórico do Bruno: 3 compras comprovadas (R$ 1.500, R$ 1.800 e R$ 900 = 420 pontos).
export function createPurchases(now: number): Purchase[] {
  const at = (days: number) => new Date(now - days * DAY).toISOString()
  return [
    {
      id: 'purchase-seed-1',
      userId: 'user-bruno',
      storeId: 'store-techplay',
      purchaseCode: '100001',
      amountCents: 150_000,
      createdAt: at(9),
    },
    {
      id: 'purchase-seed-2',
      userId: 'user-bruno',
      storeId: 'store-moda-sol',
      purchaseCode: '100002',
      amountCents: 180_000,
      createdAt: at(5),
    },
    {
      id: 'purchase-seed-3',
      userId: 'user-bruno',
      storeId: 'store-livraria-folha',
      purchaseCode: '100003',
      amountCents: 90_000,
      createdAt: at(2),
    },
  ]
}

export function createPointsEntries(now: number): PointsEntry[] {
  return createPurchases(now).map((purchase) => ({
    id: `entry-${purchase.id}`,
    userId: purchase.userId,
    points: purchase.amountCents / 1000,
    reason: 'purchase',
    refId: purchase.id,
    createdAt: purchase.createdAt,
  }))
}

// Cupom ativo do Bruno, da oferta relâmpago do Café Ipê.
export function createCoupons(now: number): Coupon[] {
  return [
    {
      id: 'coupon-seed-1',
      userId: 'user-bruno',
      source: 'offer',
      sourceId: COFFEE_FLASH_OFFER_ID,
      code: 'CAFE22',
      status: 'active',
      createdAt: new Date(now).toISOString(),
      expiresAt: new Date(now + 60 * 60_000).toISOString(),
    },
  ]
}

// Bruno indicou a Carla, que ainda não fez a primeira compra comprovada.
export function createReferrals(): Referral[] {
  return [{ id: 'referral-seed-1', referrerId: 'user-bruno', referredId: 'user-carla', status: 'pending' }]
}
