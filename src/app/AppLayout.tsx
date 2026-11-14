import { ArrowLeft, Menu, Search } from 'lucide-react'
import { useEffect } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router'
import { MallLogo } from '../components/MallLogo'
import { PrototypeNotice } from '../components/PrototypeNotice'
import { LotReleasedNotice } from '../features/offers/components/LotReleasedNotice'
import { useScrolled } from '../features/offers/components/useScrolled'

/**
 * Layout de aplicativo (abaixo de 1024 px): topo com menu, logo e busca; seta de voltar nas telas
 * internas. Na tela inicial (`/` e `/visitor`) o carrossel preenche o topo e o topo do app fica
 * transparente, com a logo em branco; ao rolar, volta a ser branco, com a logo dourada e sombra leve.
 */
export function AppLayout() {
  const navigate = useNavigate()
  const { pathname, hash } = useLocation()
  const scrolled = useScrolled()
  const isHome =
    pathname === '/' || pathname === '/visitor' || pathname === '/merchant' || pathname === '/mall'
  const hasCarousel = pathname === '/' || pathname === '/visitor'
  const transparent = hasCarousel && !scrolled

  // Cada tela abre no alto; com âncora (#ofertas), quem rola é a própria tela.
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0)
  }, [pathname, hash])

  const position = hasCarousel ? 'fixed inset-x-0 top-0 mx-auto max-w-xl' : 'sticky top-0'
  const tone = transparent ? 'text-white' : 'bg-background text-text'
  const shadow =
    hasCarousel && scrolled ? 'shadow-[0_1px_0_var(--color-line),0_4px_12px_rgb(0_0_0/0.06)]' : ''

  return (
    <div className="mx-auto flex min-h-dvh max-w-xl flex-col">
      <header
        className={`${position} ${tone} ${shadow} z-20 pt-[env(safe-area-inset-top)] transition-colors duration-200`}
      >
        <div
          className={`grid h-14 grid-cols-[48px_1fr_48px] items-center border-b ${hasCarousel ? 'border-transparent' : 'border-line'}`}
        >
          {isHome ? (
            <Link
              to="/profile"
              aria-label="Menu e perfil"
              className="flex size-12 items-center justify-center"
            >
              <Menu aria-hidden />
            </Link>
          ) : (
            <button
              type="button"
              aria-label="Voltar"
              onClick={() => navigate(-1)}
              className="flex size-12 items-center justify-center"
            >
              <ArrowLeft aria-hidden />
            </button>
          )}
          <Link to="/" className={`flex justify-center ${transparent ? '[&_span]:text-white' : ''}`}>
            <MallLogo onDark={transparent} />
          </Link>
          {/* Busca fora do MVP: o botão só marca o lugar dela no topo do app. */}
          <button
            type="button"
            aria-label="Buscar (indisponível no protótipo)"
            disabled
            className={`flex size-12 items-center justify-center ${transparent ? 'text-white/70' : 'text-muted'}`}
          >
            <Search aria-hidden />
          </button>
        </div>
        {/* Sobre o carrossel, o aviso fixo vira uma faixa translúcida para continuar legível. */}
        <div className={transparent ? '[&>p]:bg-black/25 [&>p]:text-white' : ''}>
          <PrototypeNotice />
        </div>
        <LotReleasedNotice />
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
