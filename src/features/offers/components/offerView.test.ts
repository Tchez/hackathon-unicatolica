import { describe, expect, it } from 'vitest'
import {
  COFFEE_FLASH_OFFER_ID,
  GPU_OFFER_ID,
  HEADPHONE_FLASH_OFFER_ID,
  createOffers,
} from '../../../data/offers'
import type { Offer } from '../../../types'
import {
  LOT_NOTICE_WINDOW_MS,
  campaignEndsAt,
  findAlternatives,
  findReleasedLot,
  getReleasedQuantity,
  offerHeadline,
  pickFlashOffer,
  sortByStatus,
} from './offerView'

const NOW = Date.parse('2026-11-14T12:00:00.000Z')
const MINUTE = 60_000

function seed(): Offer[] {
  return createOffers(NOW)
}

function byId(offers: Offer[], id: string): Offer {
  const offer = offers.find((item) => item.id === id)
  if (!offer) throw new Error(`oferta ${id} não existe`)
  return offer
}

/** Cópia da placa de vídeo com um lote liberado `minutesAgo` minutos antes de NOW. */
function gpuWithBatch(minutesAgo: number, quantity = 5): Offer {
  return {
    ...byId(seed(), GPU_OFFER_ID),
    batches: [{ releaseAt: new Date(NOW - minutesAgo * MINUTE).toISOString(), quantity }],
  }
}

describe('offerHeadline', () => {
  it('mantém o título que já cita o desconto', () => {
    expect(offerHeadline(byId(seed(), GPU_OFFER_ID))).toBe('Placa de vídeo 60% OFF')
  })

  it('acrescenta o desconto quando o título não o cita', () => {
    expect(offerHeadline(byId(seed(), COFFEE_FLASH_OFFER_ID))).toBe('2 cafés por R$ 12 · 30% OFF')
  })
})

describe('getReleasedQuantity', () => {
  it('soma só os lotes já liberados', () => {
    const offer: Offer = {
      ...gpuWithBatch(1, 5),
      batches: [
        { releaseAt: new Date(NOW - MINUTE).toISOString(), quantity: 5 },
        { releaseAt: new Date(NOW + MINUTE).toISOString(), quantity: 7 },
      ],
    }
    expect(getReleasedQuantity(offer, NOW)).toBe(5)
  })

  it('é zero sem lote liberado', () => {
    expect(getReleasedQuantity(byId(seed(), GPU_OFFER_ID), NOW)).toBe(0)
  })
})

describe('sortByStatus', () => {
  it('põe liberadas antes de em breve, esgotadas e encerradas', () => {
    const offers = seed()
    const soldOut: Offer = { ...byId(offers, 'offer-livro'), redeemedCount: 40 }
    const ended: Offer = { ...byId(offers, 'offer-moda'), endsAt: new Date(NOW - MINUTE).toISOString() }
    const sorted = sortByStatus(
      [ended, soldOut, byId(offers, GPU_OFFER_ID), byId(offers, COFFEE_FLASH_OFFER_ID)],
      NOW,
    )
    expect(sorted.map((offer) => offer.id)).toEqual([
      COFFEE_FLASH_OFFER_ID,
      GPU_OFFER_ID,
      'offer-livro',
      'offer-moda',
    ])
  })
})

describe('campaignEndsAt', () => {
  it('usa o último prazo entre as ofertas', () => {
    const [first, second] = seed()
    const later = { ...second, endsAt: new Date(NOW + 48 * 60 * MINUTE).toISOString() }
    expect(campaignEndsAt([first, later])).toBe(new Date(later.endsAt).getTime())
  })

  it('não tem prazo sem ofertas', () => {
    expect(campaignEndsAt([])).toBeUndefined()
  })
})

describe('findAlternatives', () => {
  it('lista liberadas de outras lojas da mesma campanha', () => {
    const offers = seed()
    const soldOutGpu: Offer = { ...gpuWithBatch(1), redeemedCount: 5 }
    const alternatives = findAlternatives(soldOutGpu, offers, NOW)
    expect(alternatives.map((offer) => offer.id).sort()).toEqual(['offer-livro', 'offer-moda'])
  })

  it('numa oferta relâmpago, aceita ofertas liberadas de qualquer campanha, menos da mesma loja', () => {
    const offers = seed()
    const alternatives = findAlternatives(byId(offers, HEADPHONE_FLASH_OFFER_ID), offers, NOW)
    expect(alternatives.map((offer) => offer.id)).not.toContain(GPU_OFFER_ID)
    expect(alternatives.map((offer) => offer.id)).toEqual(
      expect.arrayContaining(['offer-livro', 'offer-moda', COFFEE_FLASH_OFFER_ID]),
    )
  })

  it('ignora ofertas que não estão liberadas', () => {
    const offers = seed()
    const alternatives = findAlternatives(byId(offers, 'offer-livro'), offers, NOW)
    expect(alternatives.map((offer) => offer.id)).not.toContain(GPU_OFFER_ID)
  })
})

describe('pickFlashOffer', () => {
  it('escolhe a oferta relâmpago ativa de lote mais recente', () => {
    const offers = seed().map((offer) =>
      offer.id === HEADPHONE_FLASH_OFFER_ID
        ? { ...offer, batches: [{ releaseAt: new Date(NOW - MINUTE).toISOString(), quantity: 10 }] }
        : offer,
    )
    expect(pickFlashOffer(offers, NOW)?.id).toBe(HEADPHONE_FLASH_OFFER_ID)
  })

  it('ignora ofertas de campanha e as que não estão liberadas', () => {
    const offers = seed().map((offer) =>
      offer.campaignId === undefined ? { ...offer, redeemedCount: 999 } : offer,
    )
    expect(pickFlashOffer(offers, NOW)).toBeUndefined()
  })
})

describe('findReleasedLot', () => {
  it('avisa o lote liberado há pouco', () => {
    const lot = findReleasedLot([gpuWithBatch(1)], [], NOW)
    expect(lot?.offer.id).toBe(GPU_OFFER_ID)
    expect(lot?.key).toBe(`${GPU_OFFER_ID}@${NOW - MINUTE}`)
  })

  it('não avisa depois da janela de 5 min', () => {
    const minutes = LOT_NOTICE_WINDOW_MS / MINUTE + 1
    expect(findReleasedLot([gpuWithBatch(minutes)], [], NOW)).toBeUndefined()
  })

  it('não avisa oferta já resgatada nem esgotada', () => {
    expect(findReleasedLot([gpuWithBatch(1)], [GPU_OFFER_ID], NOW)).toBeUndefined()
    expect(findReleasedLot([{ ...gpuWithBatch(1), redeemedCount: 5 }], [], NOW)).toBeUndefined()
  })

  it('não avisa as ofertas liberadas desde a carga dos dados', () => {
    expect(findReleasedLot(seed(), [], NOW)).toBeUndefined()
  })

  it('devolve o lote mais recente', () => {
    const older = gpuWithBatch(3)
    const newer: Offer = {
      ...byId(seed(), 'offer-livro'),
      batches: [{ releaseAt: new Date(NOW - MINUTE).toISOString(), quantity: 5 }],
      redeemedCount: 0,
    }
    expect(findReleasedLot([older, newer], [], NOW)?.offer.id).toBe('offer-livro')
  })
})
