import { PURCHASE_CODE_LENGTH, PURCHASE_CODE_VALIDITY_MINUTES } from '../config/business-rules'
import type { PurchaseCode } from '../types'

export type PurchaseCodeError = 'not_found' | 'expired' | 'used'

export type PurchaseCodeValidation =
  { ok: true; purchaseCode: PurchaseCode } | { ok: false; error: PurchaseCodeError }

/** Mantém só os dígitos: aceita "123 456" ou "123-456". */
export function normalizeCode(input: string): string {
  return input.replace(/\D/g, '')
}

function randomDigits(length: number, random: () => number): string {
  let digits = ''
  for (let i = 0; i < length; i += 1) digits += Math.floor(random() * 10)
  return digits
}

/** Gera um código de 6 dígitos que não repete nenhum dos existentes. */
export function generatePurchaseCode(
  userId: string,
  existing: PurchaseCode[],
  now: number = Date.now(),
  random: () => number = Math.random,
): PurchaseCode {
  const taken = new Set(existing.map((item) => item.code))
  let code = randomDigits(PURCHASE_CODE_LENGTH, random)
  while (taken.has(code)) code = randomDigits(PURCHASE_CODE_LENGTH, random)
  return {
    code,
    userId,
    expiresAt: new Date(now + PURCHASE_CODE_VALIDITY_MINUTES * 60_000).toISOString(),
  }
}

/** Valida um código digitado: recusa inexistente, já usado ou vencido. */
export function validatePurchaseCode(
  input: string,
  codes: PurchaseCode[],
  now: number = Date.now(),
): PurchaseCodeValidation {
  const code = normalizeCode(input)
  const purchaseCode = codes.find((item) => item.code === code)
  if (!purchaseCode) return { ok: false, error: 'not_found' }
  if (purchaseCode.usedAt) return { ok: false, error: 'used' }
  if (new Date(purchaseCode.expiresAt).getTime() <= now) return { ok: false, error: 'expired' }
  return { ok: true, purchaseCode }
}
