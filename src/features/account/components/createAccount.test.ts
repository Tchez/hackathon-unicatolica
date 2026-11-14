import { beforeEach, describe, expect, it } from 'vitest'
import { usePointsStore } from '../../points/pointsStore'
import { useReferralStore } from '../../referral/referralStore'
import { getUser, useAccountStore } from '../accountStore'
import { useSessionStore } from '../sessionStore'
import { createDemoAccount, enterDemoAccount } from './createAccount'

const session = () => useSessionStore.getState().currentUserId
const referrals = () => useReferralStore.getState().referrals

beforeEach(() => {
  useAccountStore.getState().restoreDemoData()
})

describe('createDemoAccount', () => {
  it('com BRUNO100 entra como Ana e registra a indicação pendente', () => {
    expect(createDemoAccount('BRUNO100')).toEqual({ ok: true })
    expect(session()).toBe('user-ana')
    expect(getUser('user-ana')?.referredBy).toBe('user-bruno')
    expect(referrals().find((r) => r.referredId === 'user-ana')).toMatchObject({
      referrerId: 'user-bruno',
      status: 'pending',
    })
  })

  it('sem código entra como Ana e não registra indicação', () => {
    expect(createDemoAccount('   ')).toEqual({ ok: true })
    expect(session()).toBe('user-ana')
    expect(getUser('user-ana')?.referredBy).toBeUndefined()
    expect(referrals().some((r) => r.referredId === 'user-ana')).toBe(false)
  })

  it('código inexistente não entra e deixa seguir sem código', () => {
    const result = createDemoAccount('NADA')
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.message).toContain('Código não encontrado')
    expect(session()).toBeNull()

    expect(enterDemoAccount()).toEqual({ ok: true })
    expect(session()).toBe('user-ana')
    expect(getUser('user-ana')?.referredBy).toBeUndefined()
  })

  it('recusa o código da própria conta e a segunda indicação, sem entrar', () => {
    const self = createDemoAccount('ANA100')
    expect(self.ok).toBe(false)
    expect(session()).toBeNull()

    expect(createDemoAccount('BRUNO100').ok).toBe(true)
    useAccountStore.getState().logout()
    const again = createDemoAccount('CARLA100')
    expect(again.ok).toBe(false)
    expect(session()).toBeNull()
  })
})

describe('jornada J6', () => {
  it('Ana cria conta com BRUNO100, faz a primeira compra comprovada e os dois ganham o bônus', () => {
    expect(createDemoAccount('BRUNO100').ok).toBe(true)
    const brunoBefore = usePointsStore.getState().getBalance('user-bruno')

    const code = usePointsStore.getState().generatePurchaseCode('user-ana')
    if (!code.ok) throw new Error('código não gerado')
    expect(usePointsStore.getState().confirmPurchase('store-techplay', code.value.code, 10_000).ok).toBe(true)

    // Compra de R$ 100 = 10 pontos, mais 100 de bônus para cada lado.
    expect(usePointsStore.getState().getBalance('user-ana')).toBe(110)
    expect(usePointsStore.getState().getBalance('user-bruno')).toBe(brunoBefore + 100)
    expect(referrals().find((r) => r.referredId === 'user-ana')?.status).toBe('rewarded')
  })
})
