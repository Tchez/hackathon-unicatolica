import { describe, expect, it } from 'vitest'
import { describeNoticeForecast, describeNoticeSent, formatCount, pluralize } from './mallFormat'

describe('formatCount', () => {
  it('usa separador de milhar em pt-BR', () => {
    expect(formatCount(1200)).toBe('1.200')
    expect(formatCount(0)).toBe('0')
  })
})

describe('pluralize', () => {
  it('usa o singular só para 1', () => {
    expect(pluralize(1, 'unidade', 'unidades')).toBe('unidade')
    expect(pluralize(0, 'unidade', 'unidades')).toBe('unidades')
    expect(pluralize(5, 'unidade', 'unidades')).toBe('unidades')
  })
})

describe('avisos aos presentes', () => {
  it('antes de liberar, concorda com a quantidade', () => {
    expect(describeNoticeForecast(0)).toContain('ninguém recebe')
    expect(describeNoticeForecast(1)).toBe('1 visitante marcou "Estou no shopping" e recebe o aviso.')
    expect(describeNoticeForecast(3)).toBe('3 visitantes marcaram "Estou no shopping" e recebem o aviso.')
  })

  it('depois de liberar, concorda com a quantidade', () => {
    expect(describeNoticeSent(0)).toContain('Ninguém marcou')
    expect(describeNoticeSent(1)).toBe('1 visitante presente foi avisado.')
    expect(describeNoticeSent(2)).toBe('2 visitantes presentes foram avisados.')
  })
})
