import type { Offer, PointsEntry, Purchase } from '../../types'

/** Dados dos stores que alimentam o painel. Só entram aqui para virar contagens e somas. */
export interface MallMetricsInput {
  offers: Offer[]
  purchases: Purchase[]
  entries: PointsEntry[]
  presentUserIds: string[]
}

/**
 * Números agregados do painel do shopping (RNF05): só totais, nunca nome, código ou id de pessoa.
 * Todos os campos são números.
 */
export interface MallMetrics {
  /** Cupons de oferta resgatados, somando as ofertas de campanha e as relâmpago. */
  couponsRedeemed: number
  /** Compras confirmadas pelos lojistas com o código do visitante. */
  purchasesCount: number
  /** Soma do valor das compras comprovadas, em centavos. */
  totalPurchasedCents: number
  /** Pontos creditados: compras e bônus de indicação. */
  pointsGenerated: number
  /** Pontos gastos em trocas por recompensa (valor positivo). */
  pointsExchanged: number
  /** Visitantes que marcaram "Estou no shopping" (simulação, Q09). */
  presentVisitors: number
}

/** Calcula os números agregados a partir do estado dos stores. */
export function computeMallMetrics(input: MallMetricsInput): MallMetrics {
  const { offers, purchases, entries, presentUserIds } = input
  return {
    couponsRedeemed: offers.reduce((sum, offer) => sum + offer.redeemedCount, 0),
    purchasesCount: purchases.length,
    totalPurchasedCents: purchases.reduce((sum, purchase) => sum + purchase.amountCents, 0),
    pointsGenerated: entries.reduce((sum, entry) => (entry.points > 0 ? sum + entry.points : sum), 0),
    pointsExchanged: entries.reduce((sum, entry) => (entry.points < 0 ? sum - entry.points : sum), 0),
    presentVisitors: presentUserIds.length,
  }
}
