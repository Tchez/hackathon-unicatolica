import { Navigate, Outlet, useLocation } from 'react-router'
import { useCurrentUser } from '../features/account/accountStore'
import { useReturnPath } from '../features/account/components/useReturnPath'
import type { Role } from '../types'

interface RouteGuardProps {
  /** Perfis aceitos; "guest" aceita quem não entrou. */
  allow: (Role | 'guest')[]
}

/**
 * Sem login numa rota que exige conta leva a /login, guardando a origem. Perfil sem acesso volta à
 * origem guardada (ex.: a oferta que levou ao login) ou à tela inicial do próprio perfil.
 */
export function RouteGuard({ allow }: RouteGuardProps) {
  const user = useCurrentUser()
  const { pathname } = useLocation()
  const returnPath = useReturnPath()
  if (!user)
    return allow.includes('guest') ? <Outlet /> : <Navigate to="/login" replace state={{ from: pathname }} />
  return allow.includes(user.role) ? <Outlet /> : <Navigate to={returnPath(user.role)} replace />
}
