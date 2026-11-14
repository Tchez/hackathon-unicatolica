import { Navigate, Outlet } from 'react-router'
import { useCurrentUser } from '../features/account/accountStore'
import type { Role } from '../types'
import { HOME_BY_ROLE } from './roles'

interface RouteGuardProps {
  /** Perfis aceitos; "guest" aceita quem não entrou. */
  allow: (Role | 'guest')[]
}

/**
 * Sem login numa rota que exige conta leva a /login; perfil errado volta à tela inicial do
 * próprio perfil.
 */
export function RouteGuard({ allow }: RouteGuardProps) {
  const user = useCurrentUser()
  if (!user) return allow.includes('guest') ? <Outlet /> : <Navigate to="/login" replace />
  return allow.includes(user.role) ? <Outlet /> : <Navigate to={HOME_BY_ROLE[user.role]} replace />
}
