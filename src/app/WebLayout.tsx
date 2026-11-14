import { User as UserIcon } from 'lucide-react'
import { Link, NavLink, Outlet } from 'react-router'
import { MallLogo } from '../components/MallLogo'
import { PrototypeNotice } from '../components/PrototypeNotice'
import { useCurrentUser } from '../features/account/accountStore'
import type { Role } from '../types'
import { HOME_BY_ROLE } from './roles'

interface NavItem {
  label: string
  to: string
}

const NAV_BY_ROLE: Record<Role | 'guest', NavItem[]> = {
  guest: [{ label: 'Campanhas', to: '/visitor/campaigns' }],
  visitor: [
    { label: 'Início', to: '/visitor' },
    { label: 'Campanhas', to: '/visitor/campaigns' },
    { label: 'Meus cupons', to: '/visitor/coupons' },
    { label: 'Comprovar compra', to: '/visitor/purchase-code' },
    { label: 'Pontos', to: '/visitor/points' },
    { label: 'Indicar', to: '/visitor/referral' },
  ],
  merchant: [
    { label: 'Início', to: '/merchant' },
    { label: 'Criar oferta', to: '/merchant/offers/new' },
    { label: 'Confirmar compra', to: '/merchant/confirm-purchase' },
  ],
  mall: [
    { label: 'Painel', to: '/mall' },
    { label: 'Campanhas', to: '/mall/campaigns' },
    { label: 'Ofertas relâmpago', to: '/mall/flash-offers' },
  ],
}

/** Layout web (a partir de 1024 px): topo com navegação do perfil e menu de perfil, conteúdo centralizado. */
export function WebLayout() {
  const user = useCurrentUser()
  const items = NAV_BY_ROLE[user?.role ?? 'guest']

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-10 bg-background">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center gap-8 px-6">
          <Link to={user ? HOME_BY_ROLE[user.role] : '/'}>
            <MallLogo className="h-9" />
          </Link>
          <nav aria-label="Principal" className="flex flex-1 gap-5 text-sm">
            {items.map((item) => (
              <NavLink
                key={item.to + item.label}
                to={item.to}
                end
                className={({ isActive }) =>
                  isActive ? 'font-semibold text-primary' : 'text-muted hover:text-text'
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <Link to="/profile" className="flex items-center gap-2 rounded-card bg-surface px-3 py-2 text-sm">
            <UserIcon aria-hidden className="size-4" />
            {user ? user.name : 'Entrar'}
          </Link>
        </div>
        <div className="border-b border-line">
          <PrototypeNotice />
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1">
        <Outlet />
      </main>
    </div>
  )
}
