import { Gift, Megaphone, Receipt, Share2, Star, Ticket, type LucideIcon } from 'lucide-react'
import { Link } from 'react-router'

interface Shortcut {
  label: string
  to: string
  icon: LucideIcon
  /** Classes de cor do quadrado (fundo suave e ícone), do tema. */
  tone: string
}

const SHORTCUTS: Shortcut[] = [
  { label: 'Campanhas', to: '/visitor/campaigns', icon: Megaphone, tone: 'bg-primary-soft text-primary' },
  { label: 'Ofertas', to: '/visitor/campaigns', icon: Ticket, tone: 'bg-green-soft text-green' },
  { label: 'Meus cupons', to: '/visitor/coupons', icon: Gift, tone: 'bg-primary-soft text-primary' },
  {
    label: 'Comprovar compra',
    to: '/visitor/purchase-code',
    icon: Receipt,
    tone: 'bg-brown-soft text-brown',
  },
  { label: 'Pontos', to: '/visitor/points', icon: Star, tone: 'bg-gold-soft text-gold-dark' },
  { label: 'Indicar', to: '/visitor/referral', icon: Share2, tone: 'bg-green-soft text-green' },
]

/** Atalhos do módulo, em quadrados, como no app do shopping. */
export function ShortcutGrid() {
  return (
    <nav aria-label="Atalhos" className="grid grid-cols-3 gap-3 px-4 sm:grid-cols-4 lg:grid-cols-6">
      {SHORTCUTS.map(({ label, to, icon: Icon, tone }) => (
        <Link
          key={label}
          to={to}
          className="flex min-h-11 flex-col items-center gap-1.5 text-center text-xs text-text"
        >
          <span className={`flex size-16 items-center justify-center rounded-card ${tone}`}>
            <Icon aria-hidden className="size-7" />
          </span>
          {label}
        </Link>
      ))}
    </nav>
  )
}
