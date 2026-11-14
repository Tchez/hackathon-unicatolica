import { describe, expect, it } from 'vitest'
import { formatCountdown, formatCurrency, formatDate } from './format'

const normalize = (text: string) => text.replace(/\s/g, ' ')

describe('formatCurrency', () => {
  it('formata centavos em reais', () => {
    expect(normalize(formatCurrency(99900))).toBe('R$ 999,00')
    expect(normalize(formatCurrency(249900))).toBe('R$ 2.499,00')
    expect(normalize(formatCurrency(5))).toBe('R$ 0,05')
  })
})

describe('formatDate', () => {
  it('formata a data em pt-BR', () => {
    expect(formatDate('2026-11-14T12:00:00Z')).toBe('14/11/2026')
  })

  it('inclui o horário quando pedido', () => {
    expect(formatDate('2026-11-14T12:00:00Z', true)).toMatch(/^14\/11\/2026 \d{2}:\d{2}$/)
  })

  it('devolve vazio para data inválida', () => {
    expect(formatDate('não é data')).toBe('')
  })
})

describe('formatCountdown', () => {
  it('formata minutos e segundos', () => {
    expect(formatCountdown(599_000)).toBe('09:59')
    expect(formatCountdown(0)).toBe('00:00')
  })

  it('inclui horas quando há mais de 1 h', () => {
    expect(formatCountdown(3_723_000)).toBe('1:02:03')
  })

  it('não passa de zero', () => {
    expect(formatCountdown(-5000)).toBe('00:00')
  })
})
