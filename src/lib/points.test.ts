import { describe, expect, it } from 'vitest'
import type { PointsEntry } from '../types'
import { getBalance, pointsForAmount } from './points'

function entry(userId: string, points: number): PointsEntry {
  return {
    id: `${userId}-${points}`,
    userId,
    points,
    reason: 'purchase',
    refId: 'x',
    createdAt: '2026-11-14T12:00:00Z',
  }
}

describe('pointsForAmount', () => {
  it('dá 1 ponto a cada R$ 10', () => {
    expect(pointsForAmount(1000)).toBe(1)
    expect(pointsForAmount(18000)).toBe(18)
  })

  it('arredonda para baixo', () => {
    expect(pointsForAmount(999)).toBe(0)
    expect(pointsForAmount(1999)).toBe(1)
  })

  it('ignora valor zero, negativo ou inválido', () => {
    expect(pointsForAmount(0)).toBe(0)
    expect(pointsForAmount(-5000)).toBe(0)
    expect(pointsForAmount(Number.NaN)).toBe(0)
  })
})

describe('getBalance', () => {
  it('soma os movimentos do usuário, incluindo os negativos', () => {
    const entries = [entry('a', 420), entry('a', -100), entry('b', 50)]
    expect(getBalance(entries, 'a')).toBe(320)
    expect(getBalance(entries, 'b')).toBe(50)
  })

  it('é zero sem movimentos', () => {
    expect(getBalance([], 'a')).toBe(0)
  })
})
