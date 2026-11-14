import { CircleCheck } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation } from 'react-router'
import { SimulatedBadge } from '../../../components/SimulatedBadge'
import { COUPON_VALIDITY_MINUTES } from '../../../config/business-rules'
import type { Coupon } from '../../../types'
import { useCurrentUser } from '../../account/accountStore'
import { useOffersStore } from '../../offers/offersStore'
import { CouponCard } from '../components/CouponCard'
import { describeCoupon, getCouponState, splitCoupons } from '../components/pointsView'
import { useNow } from '../components/useNow'
import { usePointsStore } from '../pointsStore'

/** Id do cupom recém-trocado, enviado pela tela de pontos no estado da navegação. */
function getRedeemedCouponId(state: unknown): string | undefined {
  if (typeof state !== 'object' || state === null || !('redeemedCouponId' in state)) return undefined
  return typeof state.redeemedCouponId === 'string' ? state.redeemedCouponId : undefined
}

interface CouponsContentProps {
  userId: string
}

function CouponsContent({ userId }: CouponsContentProps) {
  const location = useLocation()
  const coupons = usePointsStore((state) => state.coupons)
  const markCouponUsed = usePointsStore((state) => state.markCouponUsed)
  const offers = useOffersStore((state) => state.offers)
  const now = useNow()
  const [error, setError] = useState<string | null>(null)

  const { active, past } = splitCoupons(coupons, userId, now)
  const redeemedId = getRedeemedCouponId(location.state)
  const redeemed = active.find((coupon) => coupon.id === redeemedId)

  const use = (coupon: Coupon) => {
    setError(markCouponUsed(coupon.id) ? null : 'Este cupom já foi usado ou venceu.')
  }

  return (
    <section className="mx-auto w-full max-w-xl px-4 py-6">
      <h1 className="text-xl font-semibold">Meus cupons</h1>

      {redeemed && (
        <p role="status" className="mt-4 flex items-center gap-2 rounded-card bg-green-soft p-3 text-green">
          <CircleCheck aria-hidden className="size-5 shrink-0" />
          Troca feita: {describeCoupon(redeemed, offers).title}. Mostre o código no caixa.
        </p>
      )}
      {error && (
        <p role="alert" className="mt-4 rounded-card bg-primary-soft p-3 text-sm text-primary-dark">
          {error}
        </p>
      )}

      <h2 className="mt-6 text-base font-semibold">Ativos ({active.length})</h2>
      <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted">
        Cada cupom vale {COUPON_VALIDITY_MINUTES} min a partir do resgate.
        <SimulatedBadge variant="illustrative" />
      </p>
      {active.length === 0 ? (
        <p className="mt-3 text-sm text-muted">
          Seus cupons aparecem aqui depois de resgatar uma oferta ou{' '}
          <Link to="/visitor/points" className="font-semibold text-primary underline">
            trocar pontos
          </Link>
          .
        </p>
      ) : (
        <ul className="mt-3 flex flex-col gap-3">
          {active.map((coupon) => (
            <CouponCard
              key={coupon.id}
              coupon={coupon}
              description={describeCoupon(coupon, offers)}
              state="active"
              now={now}
              highlighted={coupon.id === redeemedId}
              onUse={use}
            />
          ))}
        </ul>
      )}

      <h2 className="mt-8 text-base font-semibold">Usados e vencidos</h2>
      {past.length === 0 ? (
        <p className="mt-3 text-sm text-muted">Nenhum ainda.</p>
      ) : (
        <ul className="mt-3 flex flex-col gap-3">
          {past.map((coupon) => (
            <CouponCard
              key={coupon.id}
              coupon={coupon}
              description={describeCoupon(coupon, offers)}
              state={getCouponState(coupon, now)}
              now={now}
            />
          ))}
        </ul>
      )}
    </section>
  )
}

export function CouponsPage() {
  const user = useCurrentUser()
  // A rota só aceita visitante; sem usuário, o guarda de rota já redirecionou.
  if (!user) return null
  return <CouponsContent key={user.id} userId={user.id} />
}
