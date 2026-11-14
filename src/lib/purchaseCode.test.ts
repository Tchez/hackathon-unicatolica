import { describe, expect, it } from 'vitest'
import { generatePurchaseCode, normalizeCode, validatePurchaseCode } from './purchaseCode'

const NOW = Date.parse('2026-11-14T12:00:00Z')

describe('generatePurchaseCode', () => {
  it('gera 6 dígitos válidos por 10 minutos', () => {
    const code = generatePurchaseCode('u1', [], NOW)
    expect(code.code).toMatch(/^\d{6}$/)
    expect(code.userId).toBe('u1')
    expect(Date.parse(code.expiresAt) - NOW).toBe(10 * 60_000)
    expect(code.usedAt).toBeUndefined()
  })

  it('mantém zeros à esquerda', () => {
    expect(generatePurchaseCode('u1', [], NOW, () => 0).code).toBe('000000')
  })

  it('não repete um código existente', () => {
    const values = [0, 0, 0, 0, 0, 0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5]
    let i = 0
    const random = () => values[i++] ?? 0.9
    const existing = [{ code: '000000', userId: 'u2', expiresAt: '2026-11-14T12:10:00Z' }]
    expect(generatePurchaseCode('u1', existing, NOW, random).code).toBe('555555')
  })
})

describe('validatePurchaseCode', () => {
  const valid = { code: '123456', userId: 'u1', expiresAt: '2026-11-14T12:10:00Z' }

  it('aceita código válido, mesmo com espaço ou hífen', () => {
    const result = validatePurchaseCode('123 456', [valid], NOW)
    expect(result).toEqual({ ok: true, purchaseCode: valid })
    expect(normalizeCode('123-456')).toBe('123456')
  })

  it('recusa código inexistente', () => {
    expect(validatePurchaseCode('999999', [valid], NOW)).toEqual({ ok: false, error: 'not_found' })
  })

  it('recusa código vencido', () => {
    const late = Date.parse('2026-11-14T12:10:00Z')
    expect(validatePurchaseCode('123456', [valid], late)).toEqual({ ok: false, error: 'expired' })
  })

  it('recusa código já usado, mesmo vencido', () => {
    const used = { ...valid, usedAt: '2026-11-14T12:05:00Z' }
    expect(validatePurchaseCode('123456', [used], NOW)).toEqual({ ok: false, error: 'used' })
  })
})
