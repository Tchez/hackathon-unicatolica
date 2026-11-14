import { ChevronRight, Receipt, Share2, type LucideIcon } from 'lucide-react'
import { Link } from 'react-router'
import { SimulatedBadge } from '../../../components/SimulatedBadge'
import { REFERRAL_BONUS_POINTS } from '../../../config/business-rules'
import { IconBox } from './IconBox'
import type { Tone } from './pointsView'

interface EarnLink {
  to: string
  title: string
  description: string
  icon: LucideIcon
  tone: Tone
  illustrative: boolean
}

const LINKS: EarnLink[] = [
  {
    to: '/visitor/purchase-code',
    title: 'Comprovar compra',
    description: 'Informe o código no caixa',
    icon: Receipt,
    tone: 'brown',
    illustrative: false,
  },
  {
    to: '/visitor/referral',
    title: 'Indicar amigos',
    description: `+${REFERRAL_BONUS_POINTS} pontos para cada lado`,
    icon: Share2,
    tone: 'green',
    illustrative: true,
  },
]

/** Atalhos para ganhar mais pontos. */
export function EarnMorePoints() {
  return (
    <section aria-labelledby="earn-more" className="mt-8">
      <h2 id="earn-more" className="text-base font-semibold">
        Ganhe mais pontos
      </h2>
      <ul className="mt-2">
        {LINKS.map((link) => (
          <li key={link.to}>
            <Link to={link.to} className="flex min-h-17 items-center gap-3 border-b border-line py-3">
              <IconBox icon={link.icon} tone={link.tone} />
              <span className="min-w-0 flex-1">
                <span className="block font-semibold">{link.title}</span>
                <span className="flex flex-wrap items-center gap-2 text-sm text-muted">
                  {link.description}
                  {link.illustrative && <SimulatedBadge variant="illustrative" />}
                </span>
              </span>
              <ChevronRight aria-hidden className="size-5 shrink-0 text-muted" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
