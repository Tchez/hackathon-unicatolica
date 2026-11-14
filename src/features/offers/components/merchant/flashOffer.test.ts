import { describe, expect, it } from 'vitest'
import { FLASH_OFFER_DURATIONS_MINUTES } from '../../../../config/business-rules'
import {
  clampQuantity,
  createErrorMessage,
  durationLabel,
  FLASH_OFFER_MAX_QUANTITY,
  shortDuration,
  validateTitle,
} from './flashOffer'

describe('durationLabel', () => {
  it('rotula as durações da oferta relâmpago, marcando as de demonstração', () => {
    expect(FLASH_OFFER_DURATIONS_MINUTES.map(durationLabel)).toEqual([
      '1 minuto (demonstração)',
      '3 minutos (demonstração)',
      '10 minutos',
      '1 hora',
    ])
  })
})

describe('shortDuration', () => {
  it('abrevia para a prévia', () => {
    expect(FLASH_OFFER_DURATIONS_MINUTES.map(shortDuration)).toEqual(['1 min', '3 min', '10 min', '1 h'])
  })
})

describe('clampQuantity', () => {
  it('mantém a quantidade entre 1 e o máximo', () => {
    expect(clampQuantity(0)).toBe(1)
    expect(clampQuantity(-4)).toBe(1)
    expect(clampQuantity(7)).toBe(7)
    expect(clampQuantity(7.9)).toBe(7)
    expect(clampQuantity(99_999)).toBe(FLASH_OFFER_MAX_QUANTITY)
    expect(clampQuantity(Number.NaN)).toBe(1)
  })
})

describe('validateTitle', () => {
  it('exige produto preenchido', () => {
    expect(validateTitle('   ')).toBe('Informe o produto da oferta.')
    expect(validateTitle(' Café ')).toBeUndefined()
  })
})

describe('createErrorMessage', () => {
  it('traduz cada erro de createFlashOffer', () => {
    expect(createErrorMessage('store_not_found')).toMatch(/Loja não encontrada/)
    expect(createErrorMessage('invalid_input')).toMatch(/Confira os dados/)
  })
})
