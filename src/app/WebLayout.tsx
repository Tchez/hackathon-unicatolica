import { User as UserIcon } from 'lucide-react'
import { Link, NavLink, Outlet, useLocation } from 'react-router'
import { MallLogo } from '../components/MallLogo'
import { PrototypeNotice } from '../components/PrototypeNotice'
import { useCurrentUser } from '../features/account/accountStore'
import { LotReleasedNotice } from '../features/offers/components/LotReleasedNotice'
import { useScrolled } from '../features/offers/components/useScrolled'
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

/**
 * Layout web (a partir de 1024 px): topo com navegação do perfil e menu de perfil, conteúdo centralizado.
 * Na tela inicial (`/` e `/visitor`) o carrossel ocupa a largura e passa por trás do topo, que fica
 * transparente, com a logo em branco; ao rolar, volta a ser branco, com a logo dourada e sombra leve.
 */
export function WebLayout() {
  const user = useCurrentUser()
  const items = NAV_BY_ROLE[user?.role ?? 'guest']
  const { pathname } = useLocation()
  const scrolled = useScrolled()
  const hasCarousel = pathname === '/' || pathname === '/visitor'
  const transparent = hasCarousel && !scrolled

  const position = hasCarousel ? 'fixed inset-x-0 top-0' : 'sticky top-0'
  const tone = transparent ? 'text-white' : 'bg-background text-text'
  // Fora da tela inicial, a linha separa o topo; nela, a sombra ao rolar faz esse papel.
  const noticeBorder = hasCarousel ? '' : 'border-b border-line'
  const shadow =
    hasCarousel && scrolled ? 'shadow-[0_1px_0_var(--color-line),0_4px_12px_rgb(0_0_0/0.06)]' : ''

  return (
    <div className="flex min-h-dvh flex-col">
      <header className={`${position} ${tone} ${shadow} z-20 transition-colors duration-200`}>
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center gap-8 px-6">
          <Link
            to={user ? HOME_BY_ROLE[user.role] : '/'}
            className={transparent ? '[&_span]:text-white' : ''}
          >
            <MallLogo onDark={transparent} className="h-9" />
          </Link>
          <nav aria-label="Principal" className="flex flex-1 gap-5 text-sm">
            {items.map((item) => (
              <NavLink
                key={item.to + item.label}
                to={item.to}
                end
                className={({ isActive }) => {
                  if (transparent)
                    return isActive ? 'font-semibold text-white' : 'text-white/85 hover:text-white'
                  return isActive ? 'font-semibold text-primary' : 'text-muted hover:text-text'
                }}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <Link
            to="/profile"
            className={`flex min-h-11 items-center gap-2 rounded-card px-3 py-2 text-sm ${transparent ? 'bg-white/20' : 'bg-surface'}`}
          >
            <UserIcon aria-hidden className="size-4" />
            {user ? user.name : 'Entrar'}
          </Link>
        </div>
        {/* Sobre o carrossel, o aviso fixo vira uma faixa translúcida para continuar legível. */}
        <div className={transparent ? '[&>p]:bg-black/25 [&>p]:text-white' : noticeBorder}>
          <PrototypeNotice />
        </div>
        <LotReleasedNotice />
      </header>
      {/* Na tela inicial, o carrossel ocupa a largura toda; a própria tela centraliza o resto. */}
      <main className={`w-full flex-1 ${hasCarousel ? '' : 'mx-auto max-w-5xl'}`}>
        <Outlet />
      </main>
    </div>
  )
}
