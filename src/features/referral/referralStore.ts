import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { REFERRAL_BONUS_POINTS } from '../../config/business-rules'
import { createReferrals } from '../../data/points'
import { createId } from '../../lib/id'
import { localJSONStorage, storageKey } from '../../lib/storage'
import { registerStore } from '../../lib/storeRegistry'
import type { Referral, Result } from '../../types'
import { getUser, useAccountStore } from '../account/accountStore'

export type RegisterWithCodeError = 'invalid_user' | 'invalid_code' | 'self_referral' | 'already_referred'

export interface ReferralBonus {
  userId: string
  points: number
  referralId: string
}

interface ReferralState {
  referrals: Referral[]
  /** Cadastro com código de indicação: cria a indicação pendente e marca quem indicou o novo usuário. */
  registerWithCode: (newUserId: string, code: string) => Result<Referral, RegisterWithCodeError>
  /**
   * Chamado pelo store de pontos na primeira compra comprovada do indicado: marca a indicação como
   * paga e devolve o bônus dos dois lados. Só devolve na primeira vez; depois, lista vazia.
   */
  creditFirstPurchaseBonus: (referredId: string) => ReferralBonus[]
}

export const useReferralStore = create<ReferralState>()(
  persist(
    (set, get) => ({
      referrals: createReferrals(),
      registerWithCode: (newUserId, code) => {
        const newUser = getUser(newUserId)
        if (!newUser) return { ok: false, error: 'invalid_user' }
        if (newUser.referredBy) return { ok: false, error: 'already_referred' }
        const wanted = code.trim().toUpperCase()
        const referrer = useAccountStore.getState().users.find((user) => user.referralCode === wanted)
        if (!referrer || referrer.role !== 'visitor') return { ok: false, error: 'invalid_code' }
        if (referrer.id === newUserId) return { ok: false, error: 'self_referral' }
        const referral: Referral = {
          id: createId('referral'),
          referrerId: referrer.id,
          referredId: newUserId,
          status: 'pending',
        }
        set((state) => ({ referrals: [...state.referrals, referral] }))
        useAccountStore.getState().setReferredBy(newUserId, referrer.id)
        return { ok: true, value: referral }
      },
      creditFirstPurchaseBonus: (referredId) => {
        const referral = get().referrals.find(
          (item) => item.referredId === referredId && item.status === 'pending',
        )
        if (!referral) return []
        set((state) => ({
          referrals: state.referrals.map((item) =>
            item.id === referral.id ? { ...item, status: 'rewarded' } : item,
          ),
        }))
        return [referral.referrerId, referral.referredId].map((userId) => ({
          userId,
          points: REFERRAL_BONUS_POINTS,
          referralId: referral.id,
        }))
      },
    }),
    {
      name: storageKey('referral'),
      storage: localJSONStorage,
      partialize: (state) => ({ referrals: state.referrals }),
    },
  ),
)

registerStore({
  storageKey: storageKey('referral'),
  rehydrate: () => useReferralStore.persist.rehydrate(),
  reset: () => useReferralStore.setState({ referrals: createReferrals() }),
})
