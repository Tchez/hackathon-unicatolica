import { SquareParking, Ticket } from 'lucide-react'
import { SimulatedBadge } from '../../../components/SimulatedBadge'
import { formatCountdown, formatDate } from '../../../lib/format'
import type { Coupon } from '../../../types'
import { outlineButton } from './buttonStyles'
import { IconBox } from './IconBox'
import type { CouponDescription, CouponState } from './pointsView'

interface CouponCardProps {
  coupon: Coupon
  description: CouponDescription
  state: CouponState
  now: number
  /** Destaque do cupom recém-trocado. */
  highlighted?: boolean
  /** Uso no caixa simulado; só para cupom ativo. */
  onUse?: (coupon: Coupon) => void
}

/** Cupom com código para mostrar no caixa (ativo) ou com a situação final (usado ou vencido). */
export function CouponCard({ coupon, description, state, now, highlighted = false, onUse }: CouponCardProps) {
  const active = state === 'active'
  return (
    <li
      className={`rounded-card border p-3 ${highlighted ? 'border-green' : 'border-line'} ${active ? '' : 'opacity-70'}`}
    >
      <div className="flex items-center gap-3">
        <IconBox
          icon={description.isParking ? SquareParking : Ticket}
          tone={description.isParking ? 'green' : 'primary'}
          className="size-10"
        />
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-2 font-semibold">
            {description.title}
            {description.isParking && <SimulatedBadge />}
          </p>
          <p className="text-sm text-muted">{description.origin}</p>
        </div>
      </div>

      {active ? (
        <>
          <div className="mt-3 rounded-card bg-surface px-3 py-4 text-center">
            <p className="text-3xl font-bold tracking-widest">{coupon.code}</p>
            <p role="timer" className="mt-1 text-sm text-muted">
              Mostre no caixa · válido por{' '}
              <span className="font-semibold text-text tabular-nums">
                {formatCountdown(new Date(coupon.expiresAt).getTime() - now)}
              </span>{' '}
              (até {formatDate(coupon.expiresAt, true)})
            </p>
          </div>
          {onUse && (
            <button type="button" onClick={() => onUse(coupon)} className={`${outlineButton} mt-3`}>
              Simular uso no caixa
              <SimulatedBadge />
            </button>
          )}
        </>
      ) : (
        <p className="mt-2 text-sm text-muted">
          {state === 'used' ? 'Usado' : `Venceu em ${formatDate(coupon.expiresAt, true)}`} · código{' '}
          <span className="font-semibold tracking-wider">{coupon.code}</span>
        </p>
      )}
    </li>
  )
}
