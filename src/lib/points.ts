import { CENTS_PER_POINT } from '../config/business-rules'
import type { PointsEntry } from '../types'

/** Pontos de uma compra: 1 a cada R$ 10, arredondado para baixo (Q03). Valor inválido não pontua. */
export function pointsForAmount(amountCents: number): number {
  if (!Number.isFinite(amountCents) || amountCents <= 0) return 0
  return Math.floor(amountCents / CENTS_PER_POINT)
}

/** Saldo do usuário: soma dos seus movimentos de pontos. */
export function getBalance(entries: PointsEntry[], userId: string): number {
  return entries.filter((entry) => entry.userId === userId).reduce((sum, entry) => sum + entry.points, 0)
}
