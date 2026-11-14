import { beforeEach, describe, expect, it } from 'vitest'
import { useAccountStore } from '../accountStore'
import { useMarketingConsentStore } from './marketingConsentStore'

const consent = () => useMarketingConsentStore.getState()

beforeEach(() => {
  useAccountStore.getState().restoreDemoData()
})

describe('consentimento de marketing', () => {
  it('começa desligado para todos (RNF05)', () => {
    expect(consent().marketing['user-ana'] ?? false).toBe(false)
    expect(consent().marketing['user-bruno'] ?? false).toBe(false)
  })

  it('liga e desliga por usuário, sem afetar os outros', () => {
    consent().setMarketing('user-ana', true)
    expect(consent().marketing['user-ana']).toBe(true)
    expect(consent().marketing['user-bruno'] ?? false).toBe(false)
    consent().setMarketing('user-ana', false)
    expect(consent().marketing['user-ana']).toBe(false)
  })

  it('volta a desligado ao restaurar os dados de demonstração', () => {
    consent().setMarketing('user-ana', true)
    useAccountStore.getState().restoreDemoData()
    expect(consent().marketing).toEqual({})
  })
})
