import { CircleCheck } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Link } from 'react-router'
import { SimulatedBadge } from '../../../components/SimulatedBadge'
import type { Coupon, Offer } from '../../../types'
import { Countdown } from './Countdown'
import { offerHeadline } from './offerView'

interface CouponConfirmationProps {
  offer: Offer
  coupon: Coupon
  onClose: () => void
}

/** Confirmação do resgate: código para mostrar no caixa e link para Meus cupons. */
export function CouponConfirmation({ offer, coupon, onClose }: CouponConfirmationProps) {
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    titleRef.current?.focus()
  }, [])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="coupon-confirmation-title"
      onKeyDown={(event) => {
        if (event.key === 'Escape') onClose()
      }}
      className="fixed inset-0 z-40 flex items-end justify-center bg-black/50 p-4 sm:items-center"
    >
      <div className="w-full max-w-md rounded-card bg-background p-5 text-center shadow-xl">
        <CircleCheck aria-hidden className="mx-auto size-14 text-green" />
        <h2
          id="coupon-confirmation-title"
          ref={titleRef}
          tabIndex={-1}
          className="mt-2 text-xl font-semibold outline-none"
        >
          Cupom garantido!
        </h2>
        <p className="mt-1 text-sm text-muted">{offerHeadline(offer)}</p>
        <div className="mt-4 rounded-card bg-surface px-3 py-5">
          <p
            className="text-4xl font-bold tracking-[0.2em]"
            aria-label={`Código ${coupon.code.split('').join(' ')}`}
          >
            {coupon.code}
          </p>
          <p className="mt-2 text-sm text-muted">
            Mostre este código no caixa. Válido por{' '}
            <Countdown endsAt={coupon.expiresAt} className="font-semibold text-text" />
          </p>
        </div>
        <p className="mt-2 flex items-center justify-center gap-2 text-[13px] text-muted">
          <SimulatedBadge /> Uso no caixa simulado
        </p>
        <Link
          to="/visitor/coupons"
          className="mt-4 flex min-h-12 items-center justify-center rounded-card bg-primary px-4 font-semibold text-white"
        >
          Ver em Meus cupons
        </Link>
        <button
          type="button"
          onClick={onClose}
          className="mt-2 min-h-12 w-full rounded-card px-4 font-semibold text-primary"
        >
          Continuar vendo ofertas
        </button>
      </div>
    </div>
  )
}
