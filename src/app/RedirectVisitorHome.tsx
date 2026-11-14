import { Navigate, Outlet } from 'react-router'
import { useCurrentUser } from '../features/account/accountStore'
import { HOME_BY_ROLE } from './roles'

interface RedirectVisitorHomeProps {
  /** Rota desconhecida: leva ao início do perfil (ou ao início sem login). */
  fallback?: boolean
}

/** Início ("/"): quem entrou como visitante vai para "/visitor". */
export function RedirectVisitorHome({ fallback = false }: RedirectVisitorHomeProps) {
  const user = useCurrentUser()
  if (fallback) return <Navigate to={user ? HOME_BY_ROLE[user.role] : '/'} replace />
  if (user?.role === 'visitor') return <Navigate to={HOME_BY_ROLE.visitor} replace />
  return <Outlet />
}
