import type { Reward } from '../types'

// Regras de negócio provisórias. Toda regra em aberto cita a pergunta do PRD.

// Q03: taxa provisória, 1 ponto a cada R$ 10 (1.000 centavos), arredondado para baixo
export const CENTS_PER_POINT = 1000

// Q03: recompensas provisórias, um resgate por pessoa
export const REWARDS: Reward[] = [
  { id: 'reward-discount-10', title: 'R$ 10 de desconto', kind: 'discount', pointsCost: 500, limit: 1 },
  { id: 'reward-parking-2h', title: 'Estacionamento 2 h', kind: 'parking', pointsCost: 500, limit: 1 },
  { id: 'reward-discount-25', title: 'R$ 25 de desconto', kind: 'discount', pointsCost: 1200, limit: 1 },
]

// F27: bônus de indicação, para cada lado, na primeira compra comprovada do indicado
export const REFERRAL_BONUS_POINTS = 100

// Q14: código de compra de 6 dígitos, uso único, válido por 10 min
export const PURCHASE_CODE_LENGTH = 6
export const PURCHASE_CODE_VALIDITY_MINUTES = 10

// Q10: cupom válido por 60 min
export const COUPON_VALIDITY_MINUTES = 60
export const COUPON_CODE_LENGTH = 6

// Valor máximo aceito na demonstração, por compra confirmada pelo lojista (em centavos)
export const MAX_PURCHASE_AMOUNT_CENTS = 1_000_000

// P7 do design: um cupom por pessoa por oferta
export const MAX_COUPONS_PER_OFFER_PER_USER = 1

// P7 do design: durações da oferta relâmpago, em minutos
export const FLASH_OFFER_DURATIONS_MINUTES = [1, 3, 10, 60]

// Quantidade do lote que o painel do shopping libera por padrão (campanha 11/11)
export const MALL_BATCH_DEFAULT_QUANTITY = 5
