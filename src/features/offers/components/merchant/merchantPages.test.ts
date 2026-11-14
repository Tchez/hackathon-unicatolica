import { createElement, type ComponentType } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter, Route, Routes } from 'react-router'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { COFFEE_FLASH_OFFER_ID, HEADPHONE_FLASH_OFFER_ID } from '../../../../data/offers'
import { useAccountStore } from '../../../account/accountStore'
import { useSessionStore } from '../../../account/sessionStore'
import { ConfirmPurchasePage } from '../../../points/pages/ConfirmPurchasePage'
import { CreateOfferPage } from '../../pages/CreateOfferPage'
import { MerchantHomePage } from '../../pages/MerchantHomePage'
import { MerchantOfferPage } from '../../pages/MerchantOfferPage'

/** Renderiza a página na rota indicada, como o lojista da TechPlay. */
function render(page: ComponentType, path: string, url: string = path): string {
  return renderToStaticMarkup(
    createElement(
      MemoryRouter,
      { initialEntries: [url] },
      createElement(Routes, null, createElement(Route, { path, element: createElement(page) })),
    ),
  )
}

beforeEach(() => {
  useAccountStore.getState().restoreDemoData()
  // Na renderização no servidor, o zustand lê o estado inicial do store: a sessão entra por ele.
  useSessionStore.getInitialState().currentUserId = 'user-techplay'
})

afterEach(() => {
  useSessionStore.getInitialState().currentUserId = null
})

describe('telas do lojista (renderização)', () => {
  it('início: nome da loja, as duas ações e as ofertas da loja', () => {
    const html = render(MerchantHomePage, '/merchant')
    expect(html).toContain('TechPlay')
    expect(html).toContain('Criar oferta relâmpago')
    expect(html).toContain('Confirmar compra')
    expect(html).toContain('Suas ofertas')
    expect(html).toContain(`/merchant/offers/${HEADPHONE_FLASH_OFFER_ID}`)
    expect(html).not.toContain(`/merchant/offers/${COFFEE_FLASH_OFFER_ID}`)
  })

  it('criar oferta: campos, prévia e "Leva menos de 1 minuto"', () => {
    const html = render(CreateOfferPage, '/merchant/offers/new')
    for (const text of ['Produto', 'Desconto', 'Duração', 'Quantidade', 'Prévia', 'Publicar oferta']) {
      expect(html).toContain(text)
    }
    expect(html).toContain('Leva menos de 1 minuto')
    expect(html).toContain('1 minuto (demonstração)')
  })

  it('acompanhar: mostra a oferta da loja e recusa a de outra loja', () => {
    const own = render(
      MerchantOfferPage,
      '/merchant/offers/:offerId',
      `/merchant/offers/${HEADPHONE_FLASH_OFFER_ID}`,
    )
    expect(own).toContain('Resgates')
    expect(own).toContain('Restantes')
    expect(own).toContain('Encerrar agora')

    const other = render(
      MerchantOfferPage,
      '/merchant/offers/:offerId',
      `/merchant/offers/${COFFEE_FLASH_OFFER_ID}`,
    )
    expect(other).toContain('Oferta não encontrada')
  })

  it('confirmar compra: código, valor simulado e espera pelo código', () => {
    const html = render(ConfirmPurchasePage, '/merchant/confirm-purchase')
    expect(html).toContain('Código do cliente (6 dígitos)')
    expect(html).toContain('Simulação')
    expect(html).toContain('Aguardando o código do cliente')
  })
})
