import { REWARDS } from '../../../config/business-rules'
import { createStores } from '../../../data/stores'
import { isCouponActive } from '../../../lib/coupon'
import { pointsForAmount } from '../../../lib/points'
import type { Coupon, Offer, PointsEntry, Purchase, PurchaseCode, Reward } from '../../../types'

// Regras de exibição das telas de compras e pontos, em funções puras (testadas ao lado).
// As regras de negócio em si ficam nos stores e em `src/lib/`.

export type Tone = 'primary' | 'green' | 'gold' | 'brown'

// As lojas não mudam (mesma premissa do `confirmPurchase`), então a consulta é estática.
const STORE_NAMES = new Map(createStores().map((store) => [store.id, store.name]))

export function getStoreName(storeId: string): string {
  return STORE_NAMES.get(storeId) ?? 'Loja'
}

/** Pontos com separador de milhar em pt-BR: 1200 → "1.200". */
export function formatPoints(points: number): string {
  return points.toLocaleString('pt-BR')
}

/** Pontos com sinal para o extrato: "+18" ou "−500". */
export function formatSignedPoints(points: number): string {
  if (points === 0) return '0'
  return `${points > 0 ? '+' : '−'}${formatPoints(Math.abs(points))}`
}

/** Divide o código ao meio para leitura no caixa: "482913" → "482 913". */
export function formatPurchaseCode(code: string): string {
  const half = Math.ceil(code.length / 2)
  return `${code.slice(0, half)} ${code.slice(half)}`
}

// ---------- Código de compra ----------

export type CodeStatus = 'active' | 'expired' | 'used'

/** Último código gerado pelo usuário (os códigos são acrescentados em ordem). */
export function getLatestCode(codes: PurchaseCode[], userId: string): PurchaseCode | undefined {
  return codes.findLast((item) => item.userId === userId)
}

export function getCodeStatus(code: PurchaseCode, now: number): CodeStatus {
  if (code.usedAt) return 'used'
  return new Date(code.expiresAt).getTime() <= now ? 'expired' : 'active'
}

// ---------- Compras ----------

export interface PurchaseSummary {
  id: string
  storeName: string
  amountCents: number
  /** Pontos da compra; vem do movimento gravado, ou da regra se o movimento não existir. */
  points: number
  /** Bônus de indicação liberado por esta compra para quem a fez. */
  bonusPoints: number
  createdAt: string
}

export function summarizePurchase(purchase: Purchase, entries: PointsEntry[]): PurchaseSummary {
  const earned = entries.find((entry) => entry.reason === 'purchase' && entry.refId === purchase.id)
  // O bônus é gravado no mesmo instante da compra que o liberou.
  const bonusPoints = entries
    .filter(
      (entry) =>
        entry.reason === 'referral' &&
        entry.userId === purchase.userId &&
        entry.createdAt === purchase.createdAt,
    )
    .reduce((sum, entry) => sum + entry.points, 0)
  return {
    id: purchase.id,
    storeName: getStoreName(purchase.storeId),
    amountCents: purchase.amountCents,
    points: earned?.points ?? pointsForAmount(purchase.amountCents),
    bonusPoints,
    createdAt: purchase.createdAt,
  }
}

/** Itens do mais novo para o mais antigo; em empate de instante, o último gravado vem primeiro. */
function newestFirst<T extends { createdAt: string }>(items: T[]): T[] {
  return items
    .map((item, index) => ({ item, index, time: new Date(item.createdAt).getTime() }))
    .sort((a, b) => b.time - a.time || b.index - a.index)
    .map(({ item }) => item)
}

export function getRecentPurchases(
  purchases: Purchase[],
  entries: PointsEntry[],
  userId: string,
  limit = 5,
): PurchaseSummary[] {
  return newestFirst(purchases.filter((purchase) => purchase.userId === userId))
    .slice(0, limit)
    .map((purchase) => summarizePurchase(purchase, entries))
}

// ---------- Recompensas ----------

export type RewardAvailability =
  { status: 'available' } | { status: 'insufficient'; missing: number } | { status: 'limit' }

/** Trocas já feitas desta recompensa (usadas ou não): é o que o limite por pessoa conta. */
export function countRedeemed(coupons: Coupon[], userId: string, rewardId: string): number {
  return coupons.filter(
    (coupon) => coupon.userId === userId && coupon.source === 'reward' && coupon.sourceId === rewardId,
  ).length
}

/** Mesma ordem de checagem de `redeemReward`: limite primeiro, depois saldo. */
export function getRewardAvailability(
  reward: Reward,
  balance: number,
  redeemedCount: number,
): RewardAvailability {
  if (redeemedCount >= reward.limit) return { status: 'limit' }
  if (balance < reward.pointsCost) return { status: 'insufficient', missing: reward.pointsCost - balance }
  return { status: 'available' }
}

const TONE_BY_REWARD_ID: Record<string, Tone> = {
  'reward-discount-10': 'primary',
  'reward-parking-2h': 'green',
  'reward-discount-25': 'gold',
}

/** Cor própria de cada recompensa; recompensa nova cai na cor do tipo. */
export function getRewardTone(reward: Reward): Tone {
  return TONE_BY_REWARD_ID[reward.id] ?? (reward.kind === 'parking' ? 'green' : 'primary')
}

export interface ProgressSummary {
  title: string
  /** Pontos da meta; vazio quando não há meta a perseguir. */
  goal?: number
  /** Parte da meta já alcançada, de 0 a 100. */
  percent: number
}

/** Quanto falta para a próxima recompensa ainda disponível para o usuário. */
export function getProgressSummary(
  coupons: Coupon[],
  userId: string,
  balance: number,
  rewards: Reward[] = REWARDS,
): ProgressSummary {
  const open = rewards.filter((reward) => countRedeemed(coupons, userId, reward.id) < reward.limit)
  // A meta é a mais barata ainda fora do alcance; em empate, a primeira da lista.
  const [target] = open
    .filter((reward) => reward.pointsCost > balance)
    .sort((a, b) => a.pointsCost - b.pointsCost)
  if (target) {
    return {
      title: `Faltam ${formatPoints(target.pointsCost - balance)} para ${target.title}`,
      goal: target.pointsCost,
      percent: Math.min(100, Math.max(0, Math.floor((balance / target.pointsCost) * 100))),
    }
  }
  return {
    title:
      open.length > 0 ? 'Você já pode trocar por qualquer recompensa' : 'Você já trocou todas as recompensas',
    percent: 100,
  }
}

// ---------- Extrato ----------

export interface StatementRow {
  id: string
  createdAt: string
  description: string
  points: number
}

function describeEntry(entry: PointsEntry, purchases: Purchase[], coupons: Coupon[]): string {
  if (entry.reason === 'purchase') {
    const purchase = purchases.find((item) => item.id === entry.refId)
    return purchase ? `Compra na ${getStoreName(purchase.storeId)}` : 'Compra comprovada'
  }
  if (entry.reason === 'redemption') {
    const coupon = coupons.find((item) => item.id === entry.refId)
    const reward = REWARDS.find((item) => item.id === coupon?.sourceId)
    return reward ? `Troca: ${reward.title}` : 'Troca de pontos'
  }
  return 'Bônus de indicação'
}

export function buildStatement(
  entries: PointsEntry[],
  purchases: Purchase[],
  coupons: Coupon[],
  userId: string,
): StatementRow[] {
  return newestFirst(entries.filter((entry) => entry.userId === userId)).map((entry) => ({
    id: entry.id,
    createdAt: entry.createdAt,
    description: describeEntry(entry, purchases, coupons),
    points: entry.points,
  }))
}

// ---------- Cupons ----------

export type CouponState = 'active' | 'used' | 'expired'

export function getCouponState(coupon: Coupon, now: number): CouponState {
  if (isCouponActive(coupon, now)) return 'active'
  return coupon.status === 'used' ? 'used' : 'expired'
}

export interface CouponDescription {
  title: string
  /** Origem do cupom: oferta (com a loja) ou troca de pontos. */
  origin: string
  isParking: boolean
}

export function describeCoupon(coupon: Coupon, offers: Offer[]): CouponDescription {
  if (coupon.source === 'reward') {
    const reward = REWARDS.find((item) => item.id === coupon.sourceId)
    return {
      title: reward?.title ?? 'Recompensa',
      origin: 'Troca de pontos',
      isParking: reward?.kind === 'parking',
    }
  }
  const offer = offers.find((item) => item.id === coupon.sourceId)
  return {
    title: offer?.title ?? 'Oferta',
    origin: offer ? `Oferta · ${getStoreName(offer.storeId)}` : 'Oferta',
    isParking: false,
  }
}

/** Cupons do usuário separados em ativos e usados ou vencidos, do mais novo para o mais antigo. */
export function splitCoupons(
  coupons: Coupon[],
  userId: string,
  now: number,
): { active: Coupon[]; past: Coupon[] } {
  const mine = newestFirst(coupons.filter((coupon) => coupon.userId === userId))
  return {
    active: mine.filter((coupon) => getCouponState(coupon, now) === 'active'),
    past: mine.filter((coupon) => getCouponState(coupon, now) !== 'active'),
  }
}
