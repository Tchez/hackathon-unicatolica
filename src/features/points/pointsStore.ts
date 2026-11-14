import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { REWARDS } from '../../config/business-rules'
import { createCoupons, createPointsEntries, createPurchases } from '../../data/points'
import { createStores } from '../../data/stores'
import { createCoupon, isCouponActive } from '../../lib/coupon'
import { createId } from '../../lib/id'
import { getBalance as sumBalance, pointsForAmount } from '../../lib/points'
import {
  generatePurchaseCode as newPurchaseCode,
  validatePurchaseCode,
  type PurchaseCodeError,
} from '../../lib/purchaseCode'
import { localJSONStorage, storageKey } from '../../lib/storage'
import { registerStore } from '../../lib/storeRegistry'
import type { Coupon, PointsEntry, Purchase, PurchaseCode, Result } from '../../types'
import { getUser } from '../account/accountStore'
import { useReferralStore } from '../referral/referralStore'

export type GenerateCodeError = 'invalid_user'
export type ConfirmPurchaseError = PurchaseCodeError | 'invalid_amount' | 'store_not_found'
export type RedeemRewardError = 'invalid_user' | 'reward_not_found' | 'insufficient_points' | 'limit_reached'

export interface PurchaseConfirmation {
  purchase: Purchase
  /** Pontos da compra, para quem a fez. */
  pointsEarned: number
  /** Movimentos de bônus de indicação gerados por esta compra (vazio se não houve). */
  referralEntries: PointsEntry[]
}

interface PointsState {
  coupons: Coupon[]
  purchaseCodes: PurchaseCode[]
  purchases: Purchase[]
  entries: PointsEntry[]
  /** Visitante: gera o código de compra de 6 dígitos, de uso único e validade curta. */
  generatePurchaseCode: (userId: string, now?: number) => Result<PurchaseCode, GenerateCodeError>
  /** Lojista: confirma código e valor; cria a compra e os pontos, ou recusa o código. */
  confirmPurchase: (
    storeId: string,
    code: string,
    amountCents: number,
    now?: number,
  ) => Result<PurchaseConfirmation, ConfirmPurchaseError>
  /** Troca pontos por um cupom: exige saldo e respeita o limite por recompensa. */
  redeemReward: (userId: string, rewardId: string, now?: number) => Result<Coupon, RedeemRewardError>
  /** Saldo: soma dos movimentos de pontos do usuário. */
  getBalance: (userId: string) => number
  /** Marca o cupom como usado (no caixa). Falso se não existe, está vencido ou não está ativo. */
  markCouponUsed: (couponId: string, now?: number) => boolean
  /** Uso interno do store de ofertas: guarda o cupom gerado pelo resgate de uma oferta. */
  addCoupon: (coupon: Coupon) => void
}

function initialData(now: number = Date.now()) {
  return {
    coupons: createCoupons(now),
    purchaseCodes: [] as PurchaseCode[],
    purchases: createPurchases(now),
    entries: createPointsEntries(now),
  }
}

export const usePointsStore = create<PointsState>()(
  persist(
    (set, get) => ({
      ...initialData(),
      generatePurchaseCode: (userId, now = Date.now()) => {
        if (getUser(userId)?.role !== 'visitor') return { ok: false, error: 'invalid_user' }
        const purchaseCode = newPurchaseCode(userId, get().purchaseCodes, now)
        set((state) => ({ purchaseCodes: [...state.purchaseCodes, purchaseCode] }))
        return { ok: true, value: purchaseCode }
      },
      confirmPurchase: (storeId, code, amountCents, now = Date.now()) => {
        // As lojas não mudam; consulta os dados iniciais para não depender do store de ofertas.
        if (!createStores().some((store) => store.id === storeId)) {
          return { ok: false, error: 'store_not_found' }
        }
        if (!Number.isInteger(amountCents) || amountCents <= 0) return { ok: false, error: 'invalid_amount' }
        const validation = validatePurchaseCode(code, get().purchaseCodes, now)
        if (!validation.ok) return validation

        const { purchaseCode } = validation
        const createdAt = new Date(now).toISOString()
        const purchase: Purchase = {
          id: createId('purchase'),
          userId: purchaseCode.userId,
          storeId,
          purchaseCode: purchaseCode.code,
          amountCents,
          createdAt,
        }
        const pointsEarned = pointsForAmount(amountCents)
        const newEntries: PointsEntry[] = []
        if (pointsEarned > 0) {
          newEntries.push({
            id: createId('entry'),
            userId: purchase.userId,
            points: pointsEarned,
            reason: 'purchase',
            refId: purchase.id,
            createdAt,
          })
        }
        // Primeira compra comprovada depois que a indicação foi registrada libera o bônus dos dois
        // lados; `creditFirstPurchaseBonus` só paga uma vez e ignora quem não tem indicação pendente.
        const referralEntries: PointsEntry[] = useReferralStore
          .getState()
          .creditFirstPurchaseBonus(purchase.userId)
          .map((bonus) => ({
            id: createId('entry'),
            userId: bonus.userId,
            points: bonus.points,
            reason: 'referral' as const,
            refId: bonus.referralId,
            createdAt,
          }))

        set((state) => ({
          purchaseCodes: state.purchaseCodes.map((item) =>
            item.code === purchaseCode.code ? { ...item, usedAt: createdAt } : item,
          ),
          purchases: [...state.purchases, purchase],
          entries: [...state.entries, ...newEntries, ...referralEntries],
        }))
        return { ok: true, value: { purchase, pointsEarned, referralEntries } }
      },
      redeemReward: (userId, rewardId, now = Date.now()) => {
        if (getUser(userId)?.role !== 'visitor') return { ok: false, error: 'invalid_user' }
        const reward = REWARDS.find((item) => item.id === rewardId)
        if (!reward) return { ok: false, error: 'reward_not_found' }
        const { coupons, entries } = get()
        const alreadyRedeemed = coupons.filter(
          (item) => item.userId === userId && item.source === 'reward' && item.sourceId === rewardId,
        ).length
        if (alreadyRedeemed >= reward.limit) return { ok: false, error: 'limit_reached' }
        if (sumBalance(entries, userId) < reward.pointsCost)
          return { ok: false, error: 'insufficient_points' }

        const coupon = createCoupon(userId, 'reward', rewardId, now)
        const entry: PointsEntry = {
          id: createId('entry'),
          userId,
          points: -reward.pointsCost,
          reason: 'redemption',
          refId: coupon.id,
          createdAt: coupon.createdAt,
        }
        set((state) => ({ coupons: [...state.coupons, coupon], entries: [...state.entries, entry] }))
        return { ok: true, value: coupon }
      },
      getBalance: (userId) => sumBalance(get().entries, userId),
      markCouponUsed: (couponId, now = Date.now()) => {
        const coupon = get().coupons.find((item) => item.id === couponId)
        if (!coupon || !isCouponActive(coupon, now)) return false
        set((state) => ({
          coupons: state.coupons.map((item) => (item.id === couponId ? { ...item, status: 'used' } : item)),
        }))
        return true
      },
      addCoupon: (coupon) => set((state) => ({ coupons: [...state.coupons, coupon] })),
    }),
    {
      name: storageKey('points'),
      storage: localJSONStorage,
      partialize: (state) => ({
        coupons: state.coupons,
        purchaseCodes: state.purchaseCodes,
        purchases: state.purchases,
        entries: state.entries,
      }),
    },
  ),
)

registerStore({
  storageKey: storageKey('points'),
  rehydrate: () => usePointsStore.persist.rehydrate(),
  reset: () => usePointsStore.setState(initialData()),
})
