import type { Campaign, Offer } from '../types'

export const CAMPAIGN_1111_ID = 'campaign-1111'
export const GPU_OFFER_ID = 'offer-gpu'
export const COFFEE_FLASH_OFFER_ID = 'offer-flash-cafe'
export const HEADPHONE_FLASH_OFFER_ID = 'offer-flash-fone'

const HOUR = 3_600_000

export function createCampaigns(now: number): Campaign[] {
  return [
    {
      id: CAMPAIGN_1111_ID,
      name: '11/11 no Capim',
      date: new Date(now).toISOString(),
      storeIds: ['store-techplay', 'store-livraria-folha', 'store-moda-sol'],
      description: 'Ofertas de grande desconto em quantidade limitada, liberadas em lotes durante o dia.',
    },
  ]
}

// Datas relativas ao momento da criação dos dados; "Restaurar dados de demonstração" as renova.
export function createOffers(now: number): Offer[] {
  const iso = (offset: number) => new Date(now + offset).toISOString()
  return [
    {
      // Sem lote: o lote de 5 unidades sai pelo painel do shopping ("Liberar lote agora").
      id: GPU_OFFER_ID,
      storeId: 'store-techplay',
      campaignId: CAMPAIGN_1111_ID,
      title: 'Placa de vídeo 60% OFF',
      discountPercent: 60,
      originalPriceCents: 249_900,
      offerPriceCents: 99_900,
      batches: [],
      endsAt: iso(24 * HOUR),
      redeemedCount: 0,
    },
    {
      id: 'offer-livro',
      storeId: 'store-livraria-folha',
      campaignId: CAMPAIGN_1111_ID,
      title: 'Livros selecionados 30% OFF',
      discountPercent: 30,
      batches: [{ releaseAt: iso(-2 * HOUR), quantity: 40 }],
      endsAt: iso(24 * HOUR),
      redeemedCount: 12,
    },
    {
      id: 'offer-moda',
      storeId: 'store-moda-sol',
      campaignId: CAMPAIGN_1111_ID,
      title: 'Camisetas 40% OFF',
      discountPercent: 40,
      batches: [{ releaseAt: iso(-2 * HOUR), quantity: 30 }],
      endsAt: iso(24 * HOUR),
      redeemedCount: 8,
    },
    {
      id: COFFEE_FLASH_OFFER_ID,
      storeId: 'store-cafe-ipe',
      title: '2 cafés por R$ 12',
      discountPercent: 30,
      batches: [{ releaseAt: iso(-10 * 60_000), quantity: 20 }],
      endsAt: iso(2 * HOUR),
      redeemedCount: 1,
    },
    {
      id: HEADPHONE_FLASH_OFFER_ID,
      storeId: 'store-techplay',
      title: 'Fone Bluetooth 30% OFF',
      discountPercent: 30,
      batches: [{ releaseAt: iso(-10 * 60_000), quantity: 10 }],
      endsAt: iso(2 * HOUR),
      redeemedCount: 0,
    },
  ]
}
