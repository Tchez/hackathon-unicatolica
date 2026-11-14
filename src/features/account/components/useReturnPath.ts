import { useLocation } from 'react-router'
import { HOME_BY_ROLE } from '../../../app/roles'
import type { Role } from '../../../types'

interface ReturnState {
  from?: unknown
}

/**
 * Para onde ir depois de entrar: a tela do visitante que levou ao login (ex.: a oferta que ele
 * tentou resgatar) ou, sem origem, a tela inicial do perfil.
 */
export function useReturnPath(): (role: Role) => string {
  const { state } = useLocation()
  const from = (state as ReturnState | null)?.from
  return (role) =>
    role === 'visitor' && typeof from === 'string' && from.startsWith('/visitor') ? from : HOME_BY_ROLE[role]
}
