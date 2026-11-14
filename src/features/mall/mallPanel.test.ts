import React, { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { GPU_OFFER_ID } from '../../data/offers'
import { useAccountStore } from '../account/accountStore'
import { useOffersStore } from '../offers/offersStore'
import { usePointsStore } from '../points/pointsStore'
import { MallCampaignsPage } from './pages/MallCampaignsPage'
import { MallFlashOffersPage } from './pages/MallFlashOffersPage'
import { MallHomePage } from './pages/MallHomePage'

function render(page: () => ReturnType<typeof MallHomePage>): string {
  return renderToStaticMarkup(createElement(MemoryRouter, null, createElement(page)))
}

beforeEach(() => {
  // Na renderização no servidor, o Zustand lê o estado inicial do store. Lê o estado atual, como no
  // navegador, para as páginas mostrarem o que os stores têm agora.
  vi.spyOn(React, 'useSyncExternalStore').mockImplementation((_subscribe, getSnapshot) => getSnapshot())
  useAccountStore.getState().restoreDemoData()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('painel do shopping', () => {
  it('mostra a campanha atual, as ofertas com lotes e o botão de liberar', () => {
    const html = render(MallHomePage)
    expect(html).toContain('11/11 no Capim')
    expect(html).toContain('Placa de vídeo 60% OFF')
    expect(html).toContain('Livros selecionados 30% OFF')
    expect(html).toContain('Camisetas 40% OFF')
    expect(html).toContain('Liberar lote agora')
    expect(html).toContain('Liberadas')
    expect(html).toContain('Restantes')
  })

  it('mostra os números agregados dos stores', () => {
    const html = render(MallHomePage)
    for (const label of [
      'Cupons resgatados',
      'Compras comprovadas',
      'Valor total comprado',
      'Pontos gerados',
      'Pontos trocados',
    ]) {
      expect(html).toContain(label)
    }
    // Histórico inicial: 3 compras do Bruno somam R$ 4.200,00 e 420 pontos.
    expect(html).toContain('R$')
    expect(html).toContain('4.200,00')
    expect(html).toContain('420')
  })

  it('atualiza os números e os lotes depois de uma troca e de uma liberação', () => {
    useOffersStore.getState().releaseBatch(GPU_OFFER_ID, 5)
    usePointsStore.getState().redeemReward('user-bruno', 'reward-discount-10')
    const html = render(MallHomePage)
    expect(html).toContain('Lote 1 · 5 unidades')
    expect(html).toContain('Liberado')
  })

  it('nunca mostra dados de pessoas, mesmo com compras, cupons e presença registrados (RNF05)', () => {
    const points = usePointsStore.getState()
    const code = points.generatePurchaseCode('user-ana')
    if (!code.ok) throw new Error('código não gerado')
    points.confirmPurchase('store-techplay', code.value.code, 250_000)
    useOffersStore.getState().markPresence('user-ana', true)
    useOffersStore.getState().markPresence('user-bruno', true)
    useOffersStore.getState().releaseBatch(GPU_OFFER_ID, 5)
    useOffersStore.getState().claimCoupon('user-ana', GPU_OFFER_ID)

    const home = render(MallHomePage)
    // Prova de que a tela já reflete esses dados: R$ 4.200,00 do histórico + R$ 2.500,00 da Ana.
    expect(home).toContain('6.700,00')

    const pages = [home, render(MallCampaignsPage), render(MallFlashOffersPage)]
    const people = useAccountStore.getState().users.filter((user) => user.role === 'visitor')
    const coupons = usePointsStore.getState().coupons
    const secrets = [
      ...people.flatMap((user) => [user.name, user.id, user.referralCode]),
      ...coupons.map((coupon) => coupon.code),
      code.value.code,
    ]
    for (const html of pages) {
      for (const secret of secrets) expect(html, secret).not.toContain(secret)
    }
  })
})

describe('campanhas do shopping', () => {
  it('lista passada, atual e próxima, com data e número de lojas', () => {
    const html = render(MallCampaignsPage)
    expect(html.indexOf('10/10 no Capim')).toBeGreaterThan(-1)
    expect(html.indexOf('10/10 no Capim')).toBeLessThan(html.indexOf('11/11 no Capim'))
    expect(html.indexOf('11/11 no Capim')).toBeLessThan(html.indexOf('12/12 no Capim'))
    expect(html).toContain('Passada')
    expect(html).toContain('Atual')
    expect(html).toContain('Próxima')
    expect(html).toContain('3 lojas')
    expect(html).toContain('Simulação')
  })
})

describe('ofertas relâmpago do shopping', () => {
  it('lista as ativas com estado, contagem e restantes', () => {
    const html = render(MallFlashOffersPage)
    expect(html).toContain('2 cafés por R$ 12')
    expect(html).toContain('Fone Bluetooth 30% OFF')
    expect(html).toContain('Liberada')
    expect(html).toContain('Termina em')
    expect(html).toContain('Restantes')
    expect(html).not.toContain('Placa de vídeo')
  })

  it('tira da lista a oferta encerrada pela loja', () => {
    useOffersStore.getState().closeOffer('offer-flash-fone')
    const html = render(MallFlashOffersPage)
    expect(html).not.toContain('Fone Bluetooth')
    expect(html).toContain('2 cafés por R$ 12')
  })

  it('sem ofertas ativas, mostra o estado vazio', () => {
    useOffersStore.getState().closeOffer('offer-flash-fone')
    useOffersStore.getState().closeOffer('offer-flash-cafe')
    expect(render(MallFlashOffersPage)).toContain('Nenhuma oferta relâmpago ativa agora')
  })
})
