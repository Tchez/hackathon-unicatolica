import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { Countdown } from '../components/Countdown'
import { campaignEndsAt, sortByStatus } from '../components/offerView'
import { OfferCard } from '../components/OfferCard'
import { PresenceControl } from '../components/PresenceControl'
import { useNow } from '../components/useNow'
import { useOffersStore } from '../offersStore'

/** Campanhas e ofertas relâmpago, com contagem, restantes e estado de cada oferta. */
export function CampaignsPage() {
  const campaigns = useOffersStore((state) => state.campaigns)
  const offers = useOffersStore((state) => state.offers)
  const now = useNow()
  const { hash } = useLocation()

  // O atalho "Ofertas" chega aqui com #ofertas e rola até as ofertas relâmpago.
  useEffect(() => {
    if (hash === '#ofertas') document.getElementById('ofertas')?.scrollIntoView()
  }, [hash])

  const flashOffers = sortByStatus(
    offers.filter((offer) => offer.campaignId === undefined),
    now,
  )

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-5 lg:px-6">
      <h1 className="text-xl font-semibold">Campanhas e ofertas</h1>

      {campaigns.length === 0 && <p className="mt-4 text-muted">Nenhuma campanha no momento.</p>}
      {campaigns.map((campaign) => {
        const campaignOffers = sortByStatus(
          offers.filter((offer) => offer.campaignId === campaign.id),
          now,
        )
        const endsAt = campaignEndsAt(campaignOffers)
        return (
          <article key={campaign.id} aria-labelledby={`campaign-${campaign.id}`} className="mt-4">
            <div className="rounded-card bg-linear-to-br from-primary-dark via-primary to-gold p-4 text-white">
              <p className="text-xs font-semibold uppercase tracking-wider opacity-90">
                Campanha de data dupla
              </p>
              <h2 id={`campaign-${campaign.id}`} className="mt-1 text-[22px] font-bold leading-tight">
                {campaign.name}
              </h2>
              <p className="mt-1 text-sm opacity-95">{campaign.description}</p>
              <p className="mt-2 text-sm font-semibold">
                {endsAt !== undefined && endsAt > now ? (
                  <>
                    Termina em <Countdown endsAt={endsAt} />
                  </>
                ) : (
                  'Campanha encerrada'
                )}
              </p>
            </div>
            <PresenceControl />
            <h3 className="mb-1 mt-6 text-base font-semibold">Ofertas da campanha</h3>
            {campaignOffers.length === 0 ? (
              <p className="py-3 text-sm text-muted">Nenhuma oferta nesta campanha.</p>
            ) : (
              <div className="lg:grid lg:grid-cols-2 lg:gap-x-6">
                {campaignOffers.map((offer) => (
                  <OfferCard key={offer.id} offer={offer} />
                ))}
              </div>
            )}
          </article>
        )
      })}

      <h2 id="ofertas" className="mb-1 mt-8 scroll-mt-32 text-base font-semibold">
        Ofertas relâmpago
      </h2>
      {flashOffers.length === 0 ? (
        <p className="py-3 text-sm text-muted">Nenhuma oferta relâmpago agora. Volte em breve.</p>
      ) : (
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-6">
          {flashOffers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      )}
    </section>
  )
}
