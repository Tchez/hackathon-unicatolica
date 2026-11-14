import { createElement, type ReactElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter, Route, Routes } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { COFFEE_FLASH_OFFER_ID, TV_OFFER_ID } from '../../../data/offers'
import { OfferDetailPage } from '../pages/OfferDetailPage'
import { HomeScreen } from './HomeScreen'

// Render de servidor: o zustand entrega o estado inicial dos stores (dados de demonstração, sem
// login). Estados que dependem de mudar o store ficam cobertos nos testes de offerView e do store.
function render(path: string, element: ReactElement): string {
  return renderToStaticMarkup(
    createElement(
      MemoryRouter,
      { initialEntries: [path] },
      createElement(
        Routes,
        null,
        createElement(Route, { path: '/visitor/offers/:offerId', element }),
        createElement(Route, { path: '/', element }),
      ),
    ),
  )
}

const detail = (offerId: string) => render(`/visitor/offers/${offerId}`, createElement(OfferDetailPage))

afterEach(() => {
  vi.useRealTimers()
})

describe('detalhe da oferta', () => {
  it('em breve: lote surpresa, sem botão de resgate', () => {
    const html = detail(TV_OFFER_ID)
    expect(html).toContain('Próximo lote: surpresa')
    expect(html).not.toContain('Resgatar cupom')
  })

  it('liberada: lote liberado, estoque e botão de resgate', () => {
    const html = detail(COFFEE_FLASH_OFFER_ID)
    expect(html).toContain('Lote liberado agora')
    expect(html).toContain('19 de 20 restantes')
    expect(html).toContain('Resgatar cupom')
  })

  it('encerrada pelo relógio: mensagem, sem botão', () => {
    vi.useFakeTimers({ now: Date.now() + 3 * 3_600_000 })
    const html = detail(COFFEE_FLASH_OFFER_ID)
    expect(html).toContain('Esta oferta foi encerrada.')
    expect(html).not.toContain('Resgatar cupom')
  })

  it('oferta inexistente: mensagem e link para as ofertas', () => {
    expect(detail('offer-nao-existe')).toContain('Oferta não encontrada')
  })
})

describe('tela inicial sem login', () => {
  it('mostra campanha e oferta relâmpago, sem o slide de pontos, e convida a criar conta', () => {
    const html = render('/', createElement(HomeScreen))
    expect(html).toContain('11/11 no Capim')
    expect(html).toContain('Oferta relâmpago')
    expect(html).not.toContain('Seus pontos')
    expect(html).toContain('Criar conta')
  })
})
