import { useLocation } from 'react-router'
import { HOME_BY_ROLE } from '../../../app/roles'
import type { Role } from '../../../types'

interface ReturnState {
  from?: unknown
}

/**
 * Para onde ir depois de entrar: a tela (com query) que levou ao login, se for da área do próprio
 * perfil (ex.: a oferta que o visitante tentou resgatar); senão, a tela inicial do perfil.
 */
export function useReturnPath(): (role: Role) => string {
  const { state } = useLocation()
  const from = (state as ReturnState | null)?.from
  return (role) => {
    const home = HOME_BY_ROLE[role]
    const inRoleArea =
      typeof from === 'string' &&
      (from === home || ['/', '?', '#'].some((sep) => from.startsWith(home + sep)))
    return inRoleArea ? from : home
  }
}
