import { SimulatedBadge } from '../../../components/SimulatedBadge'
import { useOffersStore } from '../../offers/offersStore'
import { CampaignCard } from '../components/CampaignCard'
import { buildCampaignList } from '../mallCampaigns'
import { useNow } from '../useNow'

export function MallCampaignsPage() {
  const { now } = useNow()
  const campaigns = useOffersStore((state) => state.campaigns)
  const offers = useOffersStore((state) => state.offers)
  const list = buildCampaignList(campaigns, offers, now)

  return (
    <section className="flex flex-col gap-4 px-4 py-6 lg:px-6 lg:py-8">
      <div>
        <h1 className="text-xl font-semibold">Campanhas do shopping</h1>
        <p className="mt-1 text-muted">Passadas, atual e próxima, com data e número de lojas.</p>
      </div>

      <ul className="grid gap-4 lg:grid-cols-3 lg:items-start">
        {list.map((campaign) => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))}
      </ul>

      <p className="flex flex-wrap items-center gap-2 text-sm text-muted">
        Criar campanha pela tela fica fora do protótipo: as campanhas vêm dos dados simulados.
        <SimulatedBadge />
      </p>
    </section>
  )
}
