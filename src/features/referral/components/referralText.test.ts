import { describe, expect, it } from 'vitest'
import {
  buildReceivedReferralText,
  buildReferralRule,
  buildShareText,
  REFERRAL_STATUS_LABELS,
} from './referralText'

describe('referralText', () => {
  it('a regra cita o bônus de cada lado e a primeira compra comprovada', () => {
    expect(buildReferralRule(100)).toBe(
      'Você e quem você indicar ganham 100 pontos na primeira compra comprovada.',
    )
  })

  it('o texto de compartilhamento leva o código, o shopping e o bônus', () => {
    const text = buildShareText('BRUNO100', 'Capim Dourado Shopping', 100)
    expect(text).toContain('BRUNO100')
    expect(text).toContain('Capim Dourado Shopping')
    expect(text).toContain('100 pontos')
  })

  it('cada status tem o seu rótulo', () => {
    expect(REFERRAL_STATUS_LABELS.pending).toBe('Aguardando primeira compra')
    expect(REFERRAL_STATUS_LABELS.rewarded).toBe('Bônus liberado')
  })

  it('o aviso de quem foi indicado muda com o status do bônus', () => {
    expect(buildReceivedReferralText('Bruno', 'pending', 100)).toBe(
      'Você entrou com o código de Bruno. O bônus de 100 pontos cai na sua primeira compra comprovada.',
    )
    expect(buildReceivedReferralText('Bruno', 'rewarded', 100)).toBe(
      'Você entrou com o código de Bruno. Bônus de 100 pontos creditado.',
    )
  })
})
