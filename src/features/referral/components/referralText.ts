import type { ReferralStatus } from '../../../types'

/** Rótulo de cada status da indicação, como aparece na lista. */
export const REFERRAL_STATUS_LABELS: Record<ReferralStatus, string> = {
  pending: 'Aguardando primeira compra',
  rewarded: 'Bônus liberado',
}

/** Regra do programa (F27), mostrada com o selo "Valor ilustrativo". */
export function buildReferralRule(bonusPoints: number): string {
  return `Você e quem você indicar ganham ${bonusPoints} pontos na primeira compra comprovada.`
}

/** Mensagem enviada ao compartilhar o código. */
export function buildShareText(code: string, mallName: string, bonusPoints: number): string {
  return `Venha ao ${mallName}! Use meu código ${code} ao criar sua conta no app Fidelidade Shopping e ganhe ${bonusPoints} pontos na primeira compra comprovada.`
}

/** Aviso para quem entrou com o código de alguém, com o estado do bônus dele. */
export function buildReceivedReferralText(
  referrerName: string,
  status: ReferralStatus,
  bonusPoints: number,
): string {
  const entered = `Você entrou com o código de ${referrerName}.`
  return status === 'rewarded'
    ? `${entered} Bônus de ${bonusPoints} pontos creditado.`
    : `${entered} O bônus de ${bonusPoints} pontos cai na sua primeira compra comprovada.`
}
