import { beforeEach, describe, expect, it } from 'vitest'
import { formatCurrency } from '../../../../lib/format'
import { useAccountStore } from '../../../account/accountStore'
import { usePointsStore } from '../../pointsStore'
import {
  checkPurchaseForm,
  describeConfirmation,
  firstName,
  formatCodeInput,
  parseAmountToCents,
} from './confirmPurchase'

const points = () => usePointsStore.getState()

beforeEach(() => {
  useAccountStore.getState().restoreDemoData()
})

describe('parseAmountToCents', () => {
  it.each([
    ['150', 15000],
    ['150,00', 15000],
    ['150,5', 15050],
    ['150.50', 15050],
    ['1.234,56', 123456],
    ['1.234', 123400],
    ['R$ 99,90', 9990],
    ['0,99', 99],
    ['0', 0],
  ])('%s vira %i centavos', (input, cents) => {
    expect(parseAmountToCents(input)).toBe(cents)
  })

  it.each(['', '  ', 'abc', '12,345', '1,2,3', '12.', ',50', '1..2'])('recusa "%s"', (input) => {
    expect(parseAmountToCents(input)).toBeNull()
  })
})

describe('formatCodeInput', () => {
  it('guarda só os dígitos e separa em 3 + 3', () => {
    expect(formatCodeInput('1')).toBe('1')
    expect(formatCodeInput('1234')).toBe('123 4')
    expect(formatCodeInput('123-456')).toBe('123 456')
    expect(formatCodeInput('123 456 789')).toBe('123 456')
    expect(formatCodeInput('ab')).toBe('')
  })
})

describe('firstName', () => {
  it('devolve só o primeiro nome (RNF05)', () => {
    expect(firstName('Ana Souza Lima')).toBe('Ana')
    expect(firstName('  Bruno ')).toBe('Bruno')
    expect(firstName('Carla')).toBe('Carla')
  })
})

describe('checkPurchaseForm', () => {
  it('pede o código de 6 dígitos e o valor antes de confirmar', () => {
    expect(checkPurchaseForm('123', '10')).toMatchObject({ ok: false, field: 'code' })
    expect(checkPurchaseForm('123 456', '')).toMatchObject({ ok: false, field: 'amount' })
    expect(checkPurchaseForm('123 456', '0')).toEqual({
      ok: false,
      field: 'amount',
      message: 'Informe um valor de compra maior que zero',
    })
    expect(checkPurchaseForm('123 456', '120,50')).toEqual({ ok: true, code: '123456', amountCents: 12050 })
  })
})

describe('describeConfirmation: os quatro resultados da confirmação', () => {
  const confirm = (code: string, amountCents: number, now?: number) =>
    describeConfirmation(points().confirmPurchase('store-techplay', code, amountCents, now))

  it('sucesso: pontos para o cliente, só o primeiro nome', () => {
    const generated = points().generatePurchaseCode('user-ana')
    if (!generated.ok) throw new Error('código não gerado')
    expect(confirm(generated.value.code, 12_000)).toEqual({
      ok: true,
      title: 'Compra confirmada · +12 pontos para o cliente',
      detail: `Cliente: Ana · Valor: ${formatCurrency(12_000)}`,
    })
  })

  it('usa o singular com 1 ponto', () => {
    const generated = points().generatePurchaseCode('user-ana')
    if (!generated.ok) throw new Error('código não gerado')
    expect(confirm(generated.value.code, 1_000).title).toBe('Compra confirmada · +1 ponto para o cliente')
  })

  it('código inválido', () => {
    expect(confirm('000000', 5_000)).toEqual({ ok: false, title: 'Código não encontrado' })
  })

  it('código vencido', () => {
    const now = Date.now()
    const generated = points().generatePurchaseCode('user-ana', now)
    if (!generated.ok) throw new Error('código não gerado')
    expect(confirm(generated.value.code, 5_000, now + 11 * 60_000)).toEqual({
      ok: false,
      title: 'Código vencido. Peça ao cliente um novo código',
    })
  })

  it('código já usado', () => {
    const generated = points().generatePurchaseCode('user-ana')
    if (!generated.ok) throw new Error('código não gerado')
    expect(confirm(generated.value.code, 5_000).ok).toBe(true)
    expect(confirm(generated.value.code, 5_000)).toEqual({ ok: false, title: 'Este código já foi usado' })
  })

  it('valor inválido e loja inexistente', () => {
    const generated = points().generatePurchaseCode('user-ana')
    if (!generated.ok) throw new Error('código não gerado')
    expect(confirm(generated.value.code, 0).title).toBe('Informe um valor de compra maior que zero')
    expect(
      describeConfirmation(points().confirmPurchase('store-x', generated.value.code, 100)).title,
    ).toMatch(/Loja não encontrada/)
  })
})
