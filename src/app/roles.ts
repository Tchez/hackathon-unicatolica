import type { Role } from '../types'

/** Tela inicial de cada perfil. */
export const HOME_BY_ROLE: Record<Role, string> = {
  visitor: '/visitor',
  merchant: '/merchant',
  mall: '/mall',
}

export const ROLE_LABELS: Record<Role, string> = {
  visitor: 'Visitante',
  merchant: 'Lojista',
  mall: 'Administração do shopping',
}
