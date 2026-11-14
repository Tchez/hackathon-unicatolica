import { MAX_PURCHASE_AMOUNT_CENTS, PURCHASE_CODE_LENGTH } from '../../../../config/business-rules'
import { formatCurrency } from '../../../../lib/format'
import { normalizeCode } from '../../../../lib/purchaseCode'
import type { Result } from '../../../../types'
import { getUser } from '../../../account/accountStore'
import { formatPoints } from '../../../offers/components/offerView'
import type { ConfirmPurchaseError, PurchaseConfirmation } from '../../pointsStore'

/** Resultado para a tela: sucesso (verde) ou erro, com o texto principal e um detalhe opcional. */
export interface ConfirmOutcome {
  ok: boolean
  title: string
  detail?: string
}

/** Mensagem para cada recusa de `confirmPurchase` (SPEC 005, comportamento 4). */
const ERROR_MESSAGES: Record<ConfirmPurchaseError, string> = {
  not_found: 'Código não encontrado',
  expired: 'Código vencido. Peça ao cliente um novo código',
  used: 'Este código já foi usado',
  invalid_amount: 'Informe um valor de compra maior que zero',
  store_not_found: 'Loja não encontrada. Entre novamente como lojista',
}

/** Primeiro nome: o lojista não vê outros dados do cliente (RNF05). */
export function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] ?? ''
}

/** Código digitado no formato "123 456": só dígitos, até 6, com espaço depois do terceiro. */
export function formatCodeInput(raw: string): string {
  const digits = normalizeCode(raw).slice(0, PURCHASE_CODE_LENGTH)
  return digits.length > 3 ? `${digits.slice(0, 3)} ${digits.slice(3)}` : digits
}

/**
 * Valor digitado em reais para centavos: aceita "150", "150,5", "150.50" e "1.234,56".
 * Devolve null quando o texto não é um valor.
 */
export function parseAmountToCents(input: string): number | null {
  const text = input.replace(/R\$/gi, '').replace(/\s/g, '')
  if (text === '') return null
  const thousands = /^\d{1,3}(\.\d{3})+$/
  let integer: string
  let fraction = ''
  if (text.includes(',')) {
    const parts = text.split(',')
    if (parts.length !== 2) return null
    const [integerPart, fractionPart] = parts
    if (!(thousands.test(integerPart) || /^\d+$/.test(integerPart))) return null
    if (!/^\d{0,2}$/.test(fractionPart)) return null
    integer = integerPart.replace(/\./g, '')
    fraction = fractionPart
  } else if (thousands.test(text)) {
    integer = text.replace(/\./g, '')
  } else if (/^\d+(\.\d{1,2})?$/.test(text)) {
    ;[integer, fraction = ''] = text.split('.')
  } else {
    return null
  }
  const cents = Number(integer) * 100 + Number(fraction.padEnd(2, '0'))
  return Number.isSafeInteger(cents) ? cents : null
}

export type PurchaseFormCheck =
  { ok: true; code: string; amountCents: number } | { ok: false; field: 'code' | 'amount'; message: string }

/** Confere código e valor digitados antes de chamar `confirmPurchase`. */
export function checkPurchaseForm(codeInput: string, amountInput: string): PurchaseFormCheck {
  const code = normalizeCode(codeInput)
  if (code.length !== PURCHASE_CODE_LENGTH) {
    return {
      ok: false,
      field: 'code',
      message: `Digite o código de ${PURCHASE_CODE_LENGTH} dígitos do cliente`,
    }
  }
  const amountCents = parseAmountToCents(amountInput)
  if (amountCents === null) {
    return { ok: false, field: 'amount', message: 'Informe o valor da compra em reais, como 150,00' }
  }
  if (amountCents <= 0) {
    return { ok: false, field: 'amount', message: ERROR_MESSAGES.invalid_amount }
  }
  if (amountCents > MAX_PURCHASE_AMOUNT_CENTS) {
    return {
      ok: false,
      field: 'amount',
      message: `Na demonstração, o valor máximo por compra é ${formatCurrency(MAX_PURCHASE_AMOUNT_CENTS)}`,
    }
  }
  return { ok: true, code, amountCents }
}

/** Traduz o retorno de `confirmPurchase` no texto da tela. */
export function describeConfirmation(
  result: Result<PurchaseConfirmation, ConfirmPurchaseError>,
  lookupName: (userId: string) => string | undefined = (userId) => getUser(userId)?.name,
): ConfirmOutcome {
  if (!result.ok) return { ok: false, title: ERROR_MESSAGES[result.error] }

  const { purchase, pointsEarned, referralEntries } = result.value
  const customer = lookupName(purchase.userId)
  const points = `${formatPoints(pointsEarned)} ${pointsEarned === 1 ? 'ponto' : 'pontos'}`
  const amount = `Valor: ${formatCurrency(purchase.amountCents)}`
  const bonus = referralEntries
    .filter((entry) => entry.userId === purchase.userId)
    .reduce((sum, entry) => sum + entry.points, 0)
  const parts = [customer ? `Cliente: ${firstName(customer)}` : undefined, amount]
  if (bonus > 0) parts.push(`+${formatPoints(bonus)} pontos de bônus de indicação`)
  return {
    ok: true,
    title: `Compra confirmada · +${points} para o cliente`,
    detail: parts.filter(Boolean).join(' · '),
  }
}
