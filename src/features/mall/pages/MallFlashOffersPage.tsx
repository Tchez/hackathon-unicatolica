import { SimulatedBadge } from '../../../components/SimulatedBadge'
import { FlashOfferCard } from '../components/FlashOfferCard'
import { getActiveFlashOffers } from '../mallOffers'
import { useOffersStore } from '../../offers/offersStore'
import { useNow } from '../useNow'

export function MallFlashOffersPage() {
  const { now } = useNow()
  const offers = useOffersStore((state) => state.offers)
  const stores = useOffersStore((state) => state.stores)
  const flashOffers = getActiveFlashOffers(offers, now)
  const storeName = (storeId: string) => stores.find((store) => store.id === storeId)?.name ?? 'Loja'

  return (
    <section className="flex flex-col gap-4 px-4 py-6 lg:px-6 lg:py-8">
      <div>
        <h1 className="text-xl font-semibold">Ofertas relâmpago</h1>
        <p className="mt-1 text-muted">Ativas agora, publicadas pelas próprias lojas, fora das campanhas.</p>
      </div>

      {flashOffers.length === 0 ? (
        <p className="rounded-card bg-surface p-4 text-muted">Nenhuma oferta relâmpago ativa agora.</p>
      ) : (
        <ul className="grid gap-4 lg:grid-cols-2 lg:items-start">
          {flashOffers.map((offer) => (
            <FlashOfferCard key={offer.id} offer={offer} storeName={storeName(offer.storeId)} now={now} />
          ))}
        </ul>
      )}

      <p className="flex flex-wrap items-center gap-2 text-sm text-muted">
        As ofertas iniciais são dados de demonstração.
        <SimulatedBadge />
      </p>
    </section>
  )
}
