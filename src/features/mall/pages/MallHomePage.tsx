import { ArrowLeftRight, Banknote, Megaphone, MapPin, Receipt, Star, Ticket, Zap } from 'lucide-react'
import { Link } from 'react-router'
import { SimulatedBadge } from '../../../components/SimulatedBadge'
import { formatCountdown, formatCurrency, formatDate } from '../../../lib/format'
import { useOffersStore } from '../../offers/offersStore'
import { MetricCard } from '../components/MetricCard'
import { OfferReleaseCard } from '../components/OfferReleaseCard'
import { getCurrentCampaign } from '../mallCampaigns'
import { formatCount } from '../mallFormat'
import { getCampaignEndsAt, getCampaignOffers } from '../mallOffers'
import { useMallMetrics } from '../useMallMetrics'
import { useNow } from '../useNow'

export function MallHomePage() {
  const { now, refresh } = useNow()
  const campaigns = useOffersStore((state) => state.campaigns)
  const offers = useOffersStore((state) => state.offers)
  const stores = useOffersStore((state) => state.stores)
  const metrics = useMallMetrics()

  const campaign = getCurrentCampaign(campaigns, offers, now)
  const campaignOffers = campaign ? getCampaignOffers(offers, campaign.id) : []
  const endsAt = campaign ? getCampaignEndsAt(offers, campaign.id) : undefined
  const storeName = (storeId: string) => stores.find((store) => store.id === storeId)?.name ?? 'Loja'

  return (
    <section className="flex flex-col gap-8 px-4 py-6 lg:px-6 lg:py-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-xl font-semibold">Painel do shopping</h1>
        {campaign ? (
          <div className="rounded-card bg-primary p-4 text-white">
            <p className="text-xs font-semibold uppercase tracking-wide">Campanha atual</p>
            <h2 className="text-xl font-bold">{campaign.name}</h2>
            <p className="mt-1 text-sm">{campaign.description}</p>
            <p className="mt-3 text-sm font-medium">
              {formatDate(campaign.date)}
              {endsAt !== undefined &&
                ` · ${endsAt > now ? `termina em ${formatCountdown(endsAt - now)}` : 'campanha encerrada'}`}
            </p>
          </div>
        ) : (
          <p className="rounded-card bg-surface p-4 text-muted">
            Nenhuma campanha nos dados. Restaure os dados de demonstração pelo perfil.
          </p>
        )}
      </div>

      {campaign && (
        <div className="flex flex-col gap-3">
          <h2 className="flex flex-wrap items-center gap-2 font-semibold">
            Ofertas e lotes <SimulatedBadge />
          </h2>
          {campaignOffers.length === 0 ? (
            <p className="rounded-card bg-surface p-4 text-muted">Esta campanha ainda não tem ofertas.</p>
          ) : (
            <div className="grid gap-4 lg:grid-cols-3 lg:items-start">
              {campaignOffers.map((offer) => (
                <OfferReleaseCard
                  key={offer.id}
                  offer={offer}
                  storeName={storeName(offer.storeId)}
                  now={now}
                  onReleased={refresh}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col gap-3">
        <h2 className="font-semibold">Números agregados</h2>
        <ul className="grid gap-3 lg:grid-cols-3">
          <MetricCard
            label="Cupons resgatados"
            value={formatCount(metrics.couponsRedeemed)}
            icon={Ticket}
            tone="bg-primary-soft text-primary"
          />
          <MetricCard
            label="Compras comprovadas"
            value={formatCount(metrics.purchasesCount)}
            icon={Receipt}
            tone="bg-brown-soft text-brown"
          />
          <MetricCard
            label="Valor total comprado"
            value={formatCurrency(metrics.totalPurchasedCents)}
            icon={Banknote}
            tone="bg-green-soft text-green"
          />
          <MetricCard
            label="Pontos gerados"
            value={formatCount(metrics.pointsGenerated)}
            icon={Star}
            tone="bg-gold-soft text-gold-dark"
          />
          <MetricCard
            label="Pontos trocados"
            value={formatCount(metrics.pointsExchanged)}
            icon={ArrowLeftRight}
            tone="bg-gold-soft text-gold-dark"
          />
          <MetricCard
            label={'Marcaram "Estou no shopping"'}
            value={formatCount(metrics.presentVisitors)}
            icon={MapPin}
            tone="bg-green-soft text-green"
            badge={<SimulatedBadge />}
          />
        </ul>
        <p className="flex flex-wrap items-center gap-2 text-sm text-muted">
          Só números agregados, sem dados de pessoas. Inclui o histórico inicial de demonstração.
          <SimulatedBadge />
        </p>
      </div>

      {/* No layout web, estes destinos já estão no menu do topo. */}
      <nav aria-label="Mais do painel" className="grid grid-cols-2 gap-3 lg:hidden">
        <Link
          to="/mall/campaigns"
          className="flex min-h-11 flex-col items-center gap-1.5 text-center text-xs text-text"
        >
          <span className="flex size-16 items-center justify-center rounded-card bg-primary-soft text-primary">
            <Megaphone aria-hidden className="size-7" />
          </span>
          Campanhas
        </Link>
        <Link
          to="/mall/flash-offers"
          className="flex min-h-11 flex-col items-center gap-1.5 text-center text-xs text-text"
        >
          <span className="flex size-16 items-center justify-center rounded-card bg-green-soft text-green">
            <Zap aria-hidden className="size-7" />
          </span>
          Ofertas relâmpago
        </Link>
      </nav>
    </section>
  )
}
