import { COUPON_CODE_LENGTH, COUPON_VALIDITY_MINUTES } from '../config/business-rules'
import type { Coupon, CouponSource } from '../types'
import { createId } from './id'

// Sem 0/O e 1/I, para o lojista não confundir ao digitar no caixa.
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

/** Gera o código de cupom para mostrar no caixa. */
export function generateCouponCode(random: () => number = Math.random): string {
  let code = ''
  for (let i = 0; i < COUPON_CODE_LENGTH; i += 1) {
    code += ALPHABET[Math.floor(random() * ALPHABET.length)]
  }
  return code
}

/** Cria um cupom ativo, válido por 60 min (Q10). */
export function createCoupon(userId: string, source: CouponSource, sourceId: string, now: number): Coupon {
  return {
    id: createId('coupon'),
    userId,
    source,
    sourceId,
    code: generateCouponCode(),
    status: 'active',
    createdAt: new Date(now).toISOString(),
    expiresAt: new Date(now + COUPON_VALIDITY_MINUTES * 60_000).toISOString(),
  }
}

/** Cupom ativo é o não usado e ainda dentro da validade. */
export function isCouponActive(coupon: Coupon, now: number = Date.now()): boolean {
  return coupon.status === 'active' && new Date(coupon.expiresAt).getTime() > now
}
