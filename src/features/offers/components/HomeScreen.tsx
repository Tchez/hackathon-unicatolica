import { Star } from 'lucide-react'
import { useCallback, useState } from 'react'
import { Link } from 'react-router'
import { ShortcutGrid } from '../../../components/ShortcutGrid'
import { SimulatedBadge } from '../../../components/SimulatedBadge'
import { CENTS_PER_POINT, REFERRAL_BONUS_POINTS } from '../../../config/business-rules'
import { getBalance } from '../../../lib/points'
import { useCurrentUser } from '../../account/accountStore'
import { getProgressSummary } from '../../points/components/pointsView'
import { usePointsStore } from '../../points/pointsStore'
import { getOfferStatus, getRemaining, useOffersStore } from '../offersStore'
import { AppGrid } from './AppGrid'
import { remainingLabel } from './merchant/labels'
import { Countdown } from './Countdown'
import { FloatingNotice, type NoticeMessage } from './FloatingNotice'
import { HomeCarousel, type CarouselSlide } from './HomeCarousel'
import { campaignEndsAt, formatPoints, offerHeadline, pickFlashOffer } from './offerView'
import { StoreCircles } from './StoreCircles'
import { useNow } from './useNow'

const CONTENT = 'mx-auto w-full max-w-5xl px-4 lg:px-6'
const OUT_OF_PROTOTYPE = 'Não disponível no protótipo.'

/**
 * Tela inicial, igual sem login (`/`) e logado (`/visitor`): carrossel, atalhos, lojas e a grade
 * original do app. Logado, o carrossel ganha o slide de pontos.
 */
export function HomeScreen() {
  const user = useCurrentUser()
  const visitor = user?.role === 'visitor' ? user : undefined
  const offers = useOffersStore((state) => state.offers)
  const campaigns = useOffersStore((state) => state.campaigns)
  const stores = useOffersStore((state) => state.stores)
  const entries = usePointsStore((state) => state.entries)
  const coupons = usePointsStore((state) => state.coupons)
  const now = useNow()
  const [notice, setNotice] = useState<NoticeMessage | null>(null)
  const clearNotice = useCallback(() => setNotice(null), [])
  const showUnavailable = () => setNotice({ text: OUT_OF_PROTOTYPE, id: Date.now() })

  const slides: CarouselSlide[] = []

  const campaign = campaigns[0]
  if (campaign) {
    const campaignOffers = offers.filter((offer) => offer.campaignId === campaign.id)
    const endsAt = campaignEndsAt(campaignOffers)
    const running = endsAt !== undefined && endsAt > now
    const hasUpcoming = campaignOffers.some((offer) => getOfferStatus(offer, now) === 'upcoming')
    const liveCount = campaignOffers.filter((offer) => getOfferStatus(offer, now) === 'live').length
    let subtitle = 'Campanha encerrada'
    if (running) {
      if (hasUpcoming) subtitle = 'Data dupla · lote surpresa hoje'
      else if (liveCount > 0)
        subtitle = `${liveCount} ${liveCount === 1 ? 'oferta liberada' : 'ofertas liberadas'} agora`
      else subtitle = 'Todas as ofertas da campanha esgotaram'
    }
    slides.push({
      id: 'campaign',
      tone: 'bg-linear-to-br from-primary-dark via-primary to-gold',
      eyebrow: 'Campanha',
      title: campaign.name,
      subtitle,
      chip: running ? (
        <>
          Termina em&nbsp;
          <Countdown endsAt={endsAt} />
        </>
      ) : undefined,
      to: '/visitor/campaigns',
    })
  }

  const flash = pickFlashOffer(offers, now)
  if (flash) {
    const storeName = stores.find((store) => store.id === flash.storeId)?.name
    slides.push({
      id: 'flash',
      tone: 'bg-linear-to-br from-green via-green to-green/70',
      eyebrow: 'Oferta relâmpago',
      title: storeName ? `${storeName} · ${offerHeadline(flash)}` : offerHeadline(flash),
      subtitle: remainingLabel(getRemaining(flash, now)),
      chip: (
        <>
          Termina em&nbsp;
          <Countdown endsAt={flash.endsAt} />
        </>
      ),
      to: `/visitor/offers/${flash.id}`,
    })
  } else {
    slides.push({
      id: 'flash',
      tone: 'bg-linear-to-br from-green via-green to-green/70',
      eyebrow: 'Oferta relâmpago',
      title: 'Nenhuma oferta agora',
      subtitle: 'Volte em breve ou veja todas as ofertas',
      to: '/visitor/campaigns#ofertas',
    })
  }

  if (visitor) {
    const balance = getBalance(entries, visitor.id)
    const progress = getProgressSummary(coupons, visitor.id, balance)
    slides.push({
      id: 'points',
      tone: 'bg-linear-to-br from-gold-dark to-gold',
      eyebrow: 'Seus pontos',
      title: `${formatPoints(balance)} pontos`,
      subtitle: progress.title,
      chip: <SimulatedBadge variant="illustrative" />,
      to: '/visitor/points',
    })
  }

  return (
    <div className="pb-6">
      <HomeCarousel slides={slides} />
      <div className={CONTENT}>
        <ShortcutGrid />

        {!user && (
          <div className="mt-4 rounded-card bg-surface p-3.5">
            <div className="flex items-center gap-3">
              <span className="flex size-11 flex-none items-center justify-center rounded-card bg-background text-primary">
                <Star aria-hidden className="size-6" />
              </span>
              <div className="flex-1">
                <p className="text-[15px] font-semibold">Pontos e indicação</p>
                <p className="text-[13px] text-muted">
                  {`1 ponto a cada R$ ${CENTS_PER_POINT / 100} · indique e ganhem ${REFERRAL_BONUS_POINTS} pontos cada`}
                </p>
              </div>
              <SimulatedBadge variant="illustrative" />
            </div>
            <Link
              to="/login"
              state={{ from: '/', reason: 'general' }}
              className="mt-3 flex min-h-12 items-center justify-center rounded-card bg-primary px-4 font-semibold text-white"
            >
              Criar conta
            </Link>
          </div>
        )}

        <div className="mb-2.5 mt-5 flex items-baseline justify-between">
          <h2 className="text-base font-semibold">Lojas</h2>
          <button
            type="button"
            onClick={showUnavailable}
            className="min-h-11 px-1 text-sm font-medium text-primary"
          >
            Ver todas
          </button>
        </div>
        <StoreCircles onSelect={showUnavailable} />

        <h2 className="mb-2.5 mt-5 text-base font-semibold">Atalhos</h2>
        <AppGrid onUnavailable={showUnavailable} />
      </div>
      <FloatingNotice notice={notice} onDone={clearNotice} />
    </div>
  )
}
