import { SquareParking, TicketPercent, type LucideIcon } from 'lucide-react'
import type { Reward } from '../../../types'

const DETAILS: Record<Reward['kind'], { icon: LucideIcon; description: string }> = {
  discount: { icon: TicketPercent, description: 'Cupom para usar nas lojas' },
  parking: { icon: SquareParking, description: 'Saída do estacionamento sem cobrança' },
}

/** Ícone e descrição de cada tipo de recompensa. */
export function getRewardDetails(kind: Reward['kind']): { icon: LucideIcon; description: string } {
  return DETAILS[kind]
}
