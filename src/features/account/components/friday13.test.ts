import { describe, expect, it } from 'vitest'
import { isFriday13, lastFriday13, nextFriday13, registerTap } from './friday13'

const ymd = (date: Date) => [date.getDate(), date.getMonth() + 1, date.getFullYear()]
const at = (year: number, month: number, day: number) => new Date(year, month - 1, day, 12).getTime()

describe('sexta-feira 13', () => {
  it('em 14/11/2026: última 13/11/2026, próxima 13/08/2027', () => {
    expect(ymd(lastFriday13(at(2026, 11, 14)))).toEqual([13, 11, 2026])
    expect(ymd(nextFriday13(at(2026, 11, 14)))).toEqual([13, 8, 2027])
    expect(isFriday13(at(2026, 11, 14))).toBe(false)
  })

  it('no próprio dia, é sexta-feira 13 e as datas ficam antes e depois dele', () => {
    const today = at(2026, 11, 13)
    expect(isFriday13(today)).toBe(true)
    expect(ymd(lastFriday13(today))).toEqual([13, 3, 2026])
    expect(ymd(nextFriday13(today))).toEqual([13, 8, 2027])
  })

  it('atravessa a virada de ano', () => {
    expect(ymd(lastFriday13(at(2026, 2, 1)))).toEqual([13, 6, 2025])
    expect(ymd(nextFriday13(at(2026, 12, 20)))).toEqual([13, 8, 2027])
  })
})

describe('registerTap', () => {
  const tapAll = (times: number[]) => {
    let history: number[] = []
    let triggered = false
    for (const time of times) ({ history, triggered } = registerTap(history, time))
    return { history, triggered }
  }

  it('dispara no quinto toque e zera o histórico', () => {
    expect(tapAll([0, 300, 600, 900, 1200])).toEqual({ history: [], triggered: true })
  })

  it('4 toques não disparam', () => {
    expect(tapAll([0, 300, 600, 900]).triggered).toBe(false)
  })

  it('1,5 s entre toques ainda vale; mais que isso recomeça a contagem', () => {
    expect(tapAll([0, 1500, 3000, 4500, 6000]).triggered).toBe(true)
    expect(tapAll([0, 300, 600, 2200, 2500, 2800]).triggered).toBe(false)
    expect(tapAll([0, 300, 600, 2200, 2500, 2800, 3100, 3400]).triggered).toBe(true)
  })

  it('depois de disparar, o próximo toque começa do zero', () => {
    const after = tapAll([0, 100, 200, 300, 400, 500])
    expect(after).toEqual({ history: [500], triggered: false })
  })
})
