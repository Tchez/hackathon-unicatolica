// Modelo de dados do SDD, seção 5. Dinheiro em centavos, datas em ISO 8601, ids em texto.

export type Role = 'visitor' | 'merchant' | 'mall'

export interface User {
  id: string
  name: string
  role: Role
  /** Só lojista: loja em que atua. */
  storeId?: string
  referralCode: string
  /** Id de quem indicou este usuário. */
  referredBy?: string
}

export interface Store {
  id: string
  name: string
  category: string
  slogan: string
}

export interface Campaign {
  id: string
  name: string
  date: string
  storeIds: string[]
  description: string
}

export interface Batch {
  releaseAt: string
  quantity: number
}

export interface Offer {
  id: string
  storeId: string
  /** Vazio na oferta relâmpago. */
  campaignId?: string
  title: string
  discountPercent: number
  /** Preços ilustrativos, só para exibição (opcionais). */
  originalPriceCents?: number
  offerPriceCents?: number
  batches: Batch[]
  endsAt: string
  redeemedCount: number
}

export type RewardKind = 'discount' | 'parking'

export interface Reward {
  id: string
  title: string
  kind: RewardKind
  pointsCost: number
  /** Resgates por pessoa. */
  limit: number
}

export type CouponSource = 'offer' | 'reward'
export type CouponStatus = 'active' | 'used'

export interface Coupon {
  id: string
  userId: string
  source: CouponSource
  sourceId: string
  code: string
  status: CouponStatus
  createdAt: string
  /** Fim da validade (Q10). */
  expiresAt: string
}

export interface PurchaseCode {
  code: string
  userId: string
  expiresAt: string
  usedAt?: string
}

export interface Purchase {
  id: string
  userId: string
  storeId: string
  purchaseCode: string
  amountCents: number
  createdAt: string
}

export type PointsReason = 'purchase' | 'redemption' | 'referral'

export interface PointsEntry {
  id: string
  userId: string
  /** Positivo ao ganhar, negativo ao trocar. */
  points: number
  reason: PointsReason
  refId: string
  createdAt: string
}

export type ReferralStatus = 'pending' | 'rewarded'

export interface Referral {
  id: string
  referrerId: string
  referredId: string
  status: ReferralStatus
}

/** Resultado das ações de domínio: sucesso com valor ou erro com código. */
export type Result<T, E extends string> = { ok: true; value: T } | { ok: false; error: E }

export interface PollOption {
  id: string
  label: string
}

export interface Poll {
  id: string
  question: string
  options: PollOption[]
  closesAt: string
  /** Preenchido quando o shopping encerra antes do prazo. */
  closedAt?: string
}

export interface PollVote {
  pollId: string
  userId: string
  optionId: string
  createdAt: string
}
