import { Gift, Megaphone, Receipt, Share2, Star, Ticket, Vote, type LucideIcon } from 'lucide-react'
import { Link } from 'react-router'

interface Shortcut {
  label: string
  to: string
  icon: LucideIcon
  /** Classes de cor do quadrado (fundo suave e ícone), do tema: ferrugem, verde, dourado, marrom. */
  tone: string
}

const SHORTCUTS: Shortcut[] = [
  { label: 'Campanhas', to: '/visitor/campaigns', icon: Megaphone, tone: 'bg-primary-soft text-primary' },
  { label: 'Ofertas', to: '/visitor/campaigns#ofertas', icon: Ticket, tone: 'bg-green-soft text-green' },
  { label: 'Meus cupons', to: '/visitor/coupons', icon: Gift, tone: 'bg-gold-soft text-gold-dark' },
  {
    label: 'Comprovar compra',
    to: '/visitor/purchase-code',
    icon: Receipt,
    tone: 'bg-brown-soft text-brown',
  },
  { label: 'Pontos', to: '/visitor/points', icon: Star, tone: 'bg-primary-soft text-primary' },
  { label: 'Votar', to: '/visitor/poll', icon: Vote, tone: 'bg-gold-soft text-gold-dark' },
  { label: 'Indicar', to: '/visitor/referral', icon: Share2, tone: 'bg-green-soft text-green' },
]

/** Atalhos do módulo: fila que rola de lado no celular e ocupa a largura no web. */
export function ShortcutGrid() {
  return (
    <nav
      aria-label="Atalhos"
      className="-mx-4 flex gap-2.5 overflow-x-auto px-4 pt-4 [scrollbar-width:none] lg:mx-0 lg:justify-between lg:px-0 [&::-webkit-scrollbar]:hidden"
    >
      {SHORTCUTS.map(({ label, to, icon: Icon, tone }) => (
        <Link
          key={label}
          to={to}
          className="flex min-h-11 w-18 flex-none flex-col items-center gap-1.5 text-center text-[11.5px] leading-tight text-text"
        >
          <span className={`flex size-14 items-center justify-center rounded-card ${tone}`}>
            <Icon aria-hidden className="size-7" />
          </span>
          {label}
        </Link>
      ))}
    </nav>
  )
}
