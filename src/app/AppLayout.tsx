import { ArrowLeft, Menu, Search } from 'lucide-react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router'
import { MallLogo } from '../components/MallLogo'
import { PrototypeNotice } from '../components/PrototypeNotice'

/** Layout de aplicativo (abaixo de 1024 px): topo com menu, logo e busca; seta de voltar nas telas internas. */
export function AppLayout() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const isHome =
    pathname === '/' || pathname === '/visitor' || pathname === '/merchant' || pathname === '/mall'

  return (
    <div className="mx-auto flex min-h-dvh max-w-xl flex-col">
      <header className="sticky top-0 z-10 bg-background">
        <div className="grid h-14 grid-cols-[48px_1fr_48px] items-center border-b border-line">
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
          <Link to="/" className="flex justify-center">
            <MallLogo />
          </Link>
          {/* Busca fora do MVP: o botão só marca o lugar dela no topo do app. */}
          <button
            type="button"
            aria-label="Buscar (indisponível no protótipo)"
            disabled
            className="flex size-12 items-center justify-center text-muted"
          >
            <Search aria-hidden />
          </button>
        </div>
        <PrototypeNotice />
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
