import { CirclePlus, Receipt } from 'lucide-react'
import { useCurrentUser } from '../../account/accountStore'
import { InlineMessage } from '../components/merchant/InlineMessage'
import { MerchantActionCard } from '../components/merchant/MerchantActionCard'
import { MerchantOfferRow } from '../components/merchant/MerchantOfferRow'
import { getMerchantOffers } from '../components/merchant/merchantOffers'
import { useNow } from '../components/merchant/useNow'
import { useOffersStore } from '../offersStore'

/** Início do lojista: nome da loja, ações em cartões e a lista "Suas ofertas". */
export function MerchantHomePage() {
  const user = useCurrentUser()
  const stores = useOffersStore((state) => state.stores)
  const offers = useOffersStore((state) => state.offers)
  const now = useNow()

  const store = stores.find((item) => item.id === user?.storeId)
  if (!user?.storeId || !store) {
    return (
      <section className="mx-auto w-full max-w-3xl px-4 py-6 lg:px-6">
        <InlineMessage tone="error">
          Sua conta de lojista não tem uma loja vinculada. Entre novamente pelo perfil.
        </InlineMessage>
      </section>
    )
  }

  const merchantOffers = getMerchantOffers(offers, store.id, now)

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-6 lg:px-6">
      <p className="text-sm text-muted">Área do lojista · {store.category}</p>
      <h1 className="text-2xl font-semibold">{store.name}</h1>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <MerchantActionCard
          to="/merchant/offers/new"
          title="Criar oferta relâmpago"
          description="Leva menos de 1 minuto"
          icon={CirclePlus}
          tone="bg-green-soft text-green"
        />
        <MerchantActionCard
          to="/merchant/confirm-purchase"
          title="Confirmar compra"
          description="Código do cliente e valor da compra"
          icon={Receipt}
          tone="bg-brown-soft text-brown"
        />
      </div>

      <h2 className="mt-8 mb-1 text-lg font-semibold">Suas ofertas</h2>
      {merchantOffers.length === 0 ? (
        <p className="py-4 text-sm text-muted">
          Nenhuma oferta ainda. Crie a primeira oferta relâmpago da loja.
        </p>
      ) : (
        <ul className="border-t border-line">
          {merchantOffers.map(({ offer, status }) => (
            <li key={offer.id}>
              <MerchantOfferRow offer={offer} status={status} now={now} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
