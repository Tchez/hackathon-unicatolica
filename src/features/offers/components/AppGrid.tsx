import {
  CalendarDays,
  Film,
  MapPin,
  Newspaper,
  Store,
  Tag,
  Ticket,
  Utensils,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import { Link } from 'react-router'

interface GridItem {
  label: string
  icon: LucideIcon
  /** Rota do item que existe no MVP; sem rota, o item está fora do protótipo. */
  to?: string
}

// Grade original do app do shopping: só Promoções e Cupons existem no MVP.
const ITEMS: GridItem[] = [
  { label: 'Lojas', icon: Store },
  { label: 'Alimentação', icon: Utensils },
  { label: 'Serviços', icon: Wrench },
  { label: 'Notícias', icon: Newspaper },
  { label: 'Eventos', icon: CalendarDays },
  { label: 'Promoções', icon: Tag, to: '/visitor/campaigns#ofertas' },
  { label: 'Cupons', icon: Ticket, to: '/visitor/coupons' },
  { label: 'Cinema', icon: Film },
  { label: 'Mapa', icon: MapPin },
]

const ITEM_CLASS = 'flex min-h-11 flex-col items-center gap-1.5 text-center text-[11.5px] text-text'
const ICON_CLASS = 'flex size-16 items-center justify-center rounded-card bg-surface text-primary'

interface AppGridProps {
  /** Toque num item fora do protótipo. */
  onUnavailable: () => void
}

/** Grade original do app do shopping; itens fora do MVP mostram o aviso "Não disponível no protótipo". */
export function AppGrid({ onUnavailable }: AppGridProps) {
  return (
    <div className="grid grid-cols-4 gap-x-2 gap-y-3 sm:grid-cols-5 lg:grid-cols-9">
      {ITEMS.map(({ label, icon: Icon, to }) => {
        const content = (
          <>
            <span className={ICON_CLASS}>
              <Icon aria-hidden className="size-7" />
            </span>
            {label}
          </>
        )
        return to ? (
          <Link key={label} to={to} className={ITEM_CLASS}>
            {content}
          </Link>
        ) : (
          <button key={label} type="button" onClick={onUnavailable} className={ITEM_CLASS}>
            {content}
          </button>
        )
      })}
    </div>
  )
}
