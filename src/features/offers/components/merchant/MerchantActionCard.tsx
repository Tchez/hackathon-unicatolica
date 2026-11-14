import { ChevronRight, type LucideIcon } from 'lucide-react'
import { Link } from 'react-router'

interface MerchantActionCardProps {
  to: string
  title: string
  description: string
  icon: LucideIcon
  /** Classes de cor do quadrado do ícone (fundo suave e ícone), do tema. */
  tone: string
}

/** Cartão de ação do início do lojista: ícone, título, descrição e seta. */
export function MerchantActionCard({ to, title, description, icon: Icon, tone }: MerchantActionCardProps) {
  return (
    <Link to={to} className="flex min-h-18 items-center gap-3 rounded-card bg-surface p-3.5">
      <span className={`flex size-12 flex-none items-center justify-center rounded-card ${tone}`}>
        <Icon aria-hidden className="size-6" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold">{title}</span>
        <span className="block text-sm text-muted">{description}</span>
      </span>
      <ChevronRight aria-hidden className="size-5 flex-none text-muted" />
    </Link>
  )
}
