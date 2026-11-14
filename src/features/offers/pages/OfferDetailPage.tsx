import { Clock, Zap } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router'
import { SimulatedBadge } from '../../../components/SimulatedBadge'
import { MAX_COUPONS_PER_OFFER_PER_USER } from '../../../config/business-rules'
import { formatCurrency } from '../../../lib/format'
import type { Coupon, Offer } from '../../../types'
import { useCurrentUser } from '../../account/accountStore'
import { usePointsStore } from '../../points/pointsStore'
import { Countdown } from '../components/Countdown'
import { CouponConfirmation } from '../components/CouponConfirmation'
import { findAlternatives, getReleasedQuantity, offerHeadline } from '../components/offerView'
import { OfferCard } from '../components/OfferCard'
import { PresenceControl } from '../components/PresenceControl'
import { StockBar } from '../components/StockBar'
import { getStoreVisual } from '../components/storeVisual'
import { useNow } from '../components/useNow'
import { getOfferStatus, getRemaining, useOffersStore, type ClaimCouponError } from '../offersStore'

const CLAIM_MESSAGES: Record<ClaimCouponError, string> = {
  invalid_user: 'Só visitantes podem resgatar cupons. Entre com um usuário visitante.',
  offer_not_found: 'Esta oferta não existe mais.',
  upcoming: 'O lote desta oferta ainda não foi liberado.',
  sold_out: 'A oferta esgotou. Veja as alternativas abaixo.',
  ended: 'Esta oferta foi encerrada.',
  already_claimed: 'Você já resgatou esta oferta.',
}

const PRIMARY_BUTTON =
  'flex min-h-12 w-full items-center justify-center rounded-card bg-primary px-4 font-semibold text-white'
const SECONDARY_LINK =
  'flex min-h-12 w-full items-center justify-center rounded-card border border-primary px-4 font-semibold text-primary'

/** Detalhe de uma oferta: preço, estado, contagem e estoque ao vivo; resgate de cupom. */
export function OfferDetailPage() {
  const { offerId } = useParams()
  const offer = useOffersStore((state) => state.offers.find((item) => item.id === offerId))

  if (!offer) {
    return (
      <section className="mx-auto w-full max-w-xl px-4 py-6">
        <h1 className="text-xl font-semibold">Oferta não encontrada</h1>
        <p className="mt-2 text-muted">Esta oferta não existe ou foi removida.</p>
        <Link to="/visitor/campaigns" className={`${SECONDARY_LINK} mt-4`}>
          Ver campanhas e ofertas
        </Link>
      </section>
    )
  }
  return <OfferDetail offer={offer} />
}

interface OfferDetailProps {
  offer: Offer
}

function OfferDetail({ offer }: OfferDetailProps) {
  const user = useCurrentUser()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const stores = useOffersStore((state) => state.stores)
  const campaigns = useOffersStore((state) => state.campaigns)
  const offers = useOffersStore((state) => state.offers)
  const claimCoupon = useOffersStore((state) => state.claimCoupon)
  const coupons = usePointsStore((state) => state.coupons)
  const now = useNow()
  const [error, setError] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState<Coupon | null>(null)

  const status = getOfferStatus(offer, now)
  const store = stores.find((item) => item.id === offer.storeId)
  const campaign = campaigns.find((item) => item.id === offer.campaignId)
  const { icon: Icon } = getStoreVisual(store)
  const claimed = user
    ? coupons.some(
        (coupon) => coupon.userId === user.id && coupon.source === 'offer' && coupon.sourceId === offer.id,
      )
    : false

  function handleClaim() {
    if (!user) {
      // Sem conta: o convite para criar conta fica no /login, que volta para esta oferta.
      navigate('/login', { state: { from: pathname, reason: 'claim' } })
      return
    }
    const result = claimCoupon(user.id, offer.id)
    if (result.ok) {
      setError(null)
      setConfirmed(result.value)
    } else {
      setError(CLAIM_MESSAGES[result.error])
    }
  }

  const couponsLink = (
    <Link to="/visitor/coupons" className={SECONDARY_LINK}>
      Ver em Meus cupons
    </Link>
  )

  return (
    <article className="mx-auto w-full max-w-xl px-4 py-4 lg:py-6">
      <Link
        to="/visitor/campaigns"
        className="mb-3 hidden min-h-11 items-center text-sm font-medium text-primary lg:inline-flex"
      >
        ← Campanhas e ofertas
      </Link>
      <div className="flex h-44 items-center justify-center rounded-card bg-linear-to-br from-text via-muted to-text text-white/80">
        <Icon aria-hidden className="size-16" />
      </div>
      <h1 className="mt-3.5 text-xl font-semibold">{offerHeadline(offer)}</h1>
      <p className="mt-0.5 text-sm text-muted">
        {store?.name}
        {campaign ? ` · ${campaign.name}` : ' · Oferta relâmpago'}
      </p>

      {offer.originalPriceCents !== undefined && offer.offerPriceCents !== undefined && (
        <div className="mt-2">
          <p className="flex items-baseline gap-2">
            <s className="text-sm text-muted">de {formatCurrency(offer.originalPriceCents)}</s>
            <span className="text-sm text-muted">por</span>
            <b className="text-[26px] font-bold text-primary">{formatCurrency(offer.offerPriceCents)}</b>
          </p>
          <p className="mt-1">
            <SimulatedBadge variant="illustrative" />
          </p>
        </div>
      )}

      {status === 'upcoming' && (
        <>
          <div className="mt-3.5 flex min-h-12 items-center gap-2.5 border-b border-line py-3 font-semibold text-gold-dark">
            <Clock aria-hidden className="size-5 flex-none" />
            Próximo lote: surpresa
          </div>
          <p className="mt-3 text-sm text-muted">
            O horário não é divulgado. Marque que está no shopping para receber o aviso quando o lote for
            liberado. A oferta termina em{' '}
            <Countdown endsAt={offer.endsAt} className="font-semibold text-text" />.
          </p>
          <PresenceControl />
        </>
      )}

      {status === 'live' && (
        <>
          <div className="mt-3.5 flex min-h-12 items-center gap-2.5 border-b border-line py-3">
            <Zap aria-hidden className="size-5 flex-none text-green" />
            <b className="font-semibold text-green">Lote liberado agora</b>
            <span className="ml-auto rounded-md bg-primary-soft px-2.5 py-0.5 text-sm font-semibold text-primary">
              Termina em <Countdown endsAt={offer.endsAt} />
            </span>
          </div>
          <StockBar remaining={getRemaining(offer, now)} total={getReleasedQuantity(offer, now)} />
          {error && (
            <p role="alert" className="mb-3 rounded-card bg-primary-soft p-3 text-sm text-primary-dark">
              {error}
            </p>
          )}
          {claimed ? (
            <div className="space-y-2">
              <p className="rounded-card bg-green-soft p-3 text-sm font-medium text-green">
                Você já resgatou esta oferta.
              </p>
              {couponsLink}
            </div>
          ) : (
            <>
              <button type="button" onClick={handleClaim} className={PRIMARY_BUTTON}>
                Resgatar cupom
              </button>
              <p className="mt-2 text-center text-[13px] text-muted">
                {MAX_COUPONS_PER_OFFER_PER_USER} cupom por pessoa{user ? '' : ' · exige conta'}
              </p>
            </>
          )}
          <PresenceControl />
        </>
      )}

      {status === 'sold_out' && (
        <>
          <p role="status" className="mt-3.5 rounded-card bg-brown-soft p-3 text-sm font-medium text-brown">
            Esta oferta esgotou.
          </p>
          {claimed && <div className="mt-3">{couponsLink}</div>}
          <Alternatives offer={offer} offers={offers} now={now} />
        </>
      )}

      {status === 'ended' && (
        <>
          <p role="status" className="mt-3.5 rounded-card bg-surface p-3 text-sm font-medium text-muted">
            Esta oferta foi encerrada.
          </p>
          <div className="mt-3 space-y-2">
            {claimed && couponsLink}
            <Link to="/visitor/campaigns" className={SECONDARY_LINK}>
              Ver outras ofertas
            </Link>
          </div>
        </>
      )}

      {confirmed && (
        <CouponConfirmation offer={offer} coupon={confirmed} onClose={() => setConfirmed(null)} />
      )}
    </article>
  )
}

interface AlternativesProps {
  offer: Offer
  offers: Offer[]
  now: number
}

/** Oferta esgotada: outras ofertas liberadas, de outras lojas da mesma campanha. */
function Alternatives({ offer, offers, now }: AlternativesProps) {
  const alternatives = findAlternatives(offer, offers, now)
  return (
    <section aria-labelledby="alternatives-title" className="mt-6">
      <h2 id="alternatives-title" className="text-base font-semibold">
        Alternativas de outras lojas
      </h2>
      {alternatives.length === 0 ? (
        <p className="py-3 text-sm text-muted">Nenhuma outra oferta liberada agora.</p>
      ) : (
        alternatives.map((alternative) => <OfferCard key={alternative.id} offer={alternative} />)
      )}
    </section>
  )
}
