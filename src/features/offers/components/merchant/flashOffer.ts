import type { CreateFlashOfferError } from '../../offersStore'

// Opções do formulário de oferta relâmpago (SPEC 005 e protótipo). As durações vêm de
// FLASH_OFFER_DURATIONS_MINUTES em src/config/business-rules.ts.
export const FLASH_OFFER_DISCOUNTS = [10, 20, 30, 40, 50]
export const FLASH_OFFER_MIN_QUANTITY = 1
export const FLASH_OFFER_MAX_QUANTITY = 1000
export const FLASH_OFFER_TITLE_MAX_LENGTH = 60

export const DEFAULT_DISCOUNT_PERCENT = 20
export const DEFAULT_DURATION_MINUTES = 3
export const DEFAULT_QUANTITY = 5

/** Durações de 1 e 3 min existem só para a demonstração (P7 do design). */
const DEMO_DURATIONS_MINUTES = [1, 3]

/** Texto da duração no campo: "1 minuto (demonstração)", "10 minutos", "1 hora". */
export function durationLabel(minutes: number): string {
  const demo = DEMO_DURATIONS_MINUTES.includes(minutes) ? ' (demonstração)' : ''
  if (minutes >= 60 && minutes % 60 === 0) {
    const hours = minutes / 60
    return `${hours} ${hours === 1 ? 'hora' : 'horas'}`
  }
  return `${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}${demo}`
}

/** Duração curta para a prévia: "1 min", "10 min", "1 h". */
export function shortDuration(minutes: number): string {
  return minutes >= 60 && minutes % 60 === 0 ? `${minutes / 60} h` : `${minutes} min`
}

/** Mantém a quantidade inteira dentro dos limites do formulário. */
export function clampQuantity(value: number): number {
  if (!Number.isFinite(value)) return FLASH_OFFER_MIN_QUANTITY
  return Math.min(FLASH_OFFER_MAX_QUANTITY, Math.max(FLASH_OFFER_MIN_QUANTITY, Math.trunc(value)))
}

/** Mensagem para cada erro de `createFlashOffer`. */
export function createErrorMessage(error: CreateFlashOfferError): string {
  switch (error) {
    case 'store_not_found':
      return 'Loja não encontrada. Entre novamente como lojista.'
    case 'invalid_input':
      return 'Confira os dados: informe o produto, um desconto e uma quantidade válidos.'
  }
}

/** Mensagem de erro do formulário antes de chamar a ação, ou undefined se o produto está preenchido. */
export function validateTitle(title: string): string | undefined {
  return title.trim().length === 0 ? 'Informe o produto da oferta.' : undefined
}
