import { useMemo } from 'react'
import { useOffersStore } from '../offers/offersStore'
import { usePointsStore } from '../points/pointsStore'
import { computeMallMetrics, type MallMetrics } from './mallMetrics'

/** Números agregados do painel, recalculados quando os stores mudam (inclusive por outra aba). */
export function useMallMetrics(): MallMetrics {
  const offers = useOffersStore((state) => state.offers)
  const presentUserIds = useOffersStore((state) => state.presentUserIds)
  const purchases = usePointsStore((state) => state.purchases)
  const entries = usePointsStore((state) => state.entries)
  return useMemo(
    () => computeMallMetrics({ offers, purchases, entries, presentUserIds }),
    [offers, purchases, entries, presentUserIds],
  )
}
