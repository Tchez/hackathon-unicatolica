import { MapPin } from 'lucide-react'
import { Link, useLocation } from 'react-router'
import { SimulatedBadge } from '../../../components/SimulatedBadge'
import { useCurrentUser } from '../../account/accountStore'
import { useOffersStore } from '../offersStore'

/**
 * "Estou no shopping" (simulação, Q09): quem marca recebe o aviso no topo quando um lote é
 * liberado. Sem login, o botão leva a /login.
 */
export function PresenceControl() {
  const user = useCurrentUser()
  const { pathname } = useLocation()
  const present = useOffersStore((state) => (user ? state.presentUserIds.includes(user.id) : false))
  const markPresence = useOffersStore((state) => state.markPresence)

  if (user && user.role !== 'visitor') return null

  if (!user) {
    return (
      <div className="mt-4">
        <Link
          to="/login"
          state={{ from: pathname, reason: 'presence' }}
          className="flex min-h-12 items-center justify-center gap-2 rounded-card border border-primary px-4 font-semibold text-primary"
        >
          <MapPin aria-hidden className="size-5" />
          Entrar para receber o aviso do lote
        </Link>
        <p className="mt-2 flex items-center justify-center gap-2 text-center text-[13px] text-muted">
          <SimulatedBadge /> Marque que está no shopping e receba o aviso
        </p>
      </div>
    )
  }

  if (present) {
    return (
      <div className="mt-4 rounded-card bg-surface p-3 text-sm">
        <p className="flex items-start gap-2.5">
          <MapPin aria-hidden className="mt-0.5 size-5 flex-none text-primary" />
          <span>Você está no shopping. Avisaremos quando um lote for liberado.</span>
        </p>
        <div className="mt-1 flex items-center justify-between gap-2 pl-7.5">
          <SimulatedBadge />
          <button
            type="button"
            onClick={() => markPresence(user.id, false)}
            className="min-h-11 px-2 text-sm font-medium text-primary"
          >
            Desmarcar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={() => markPresence(user.id, true)}
        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-card border border-primary px-4 font-semibold text-primary"
      >
        <MapPin aria-hidden className="size-5" />
        Estou no shopping
      </button>
      <p className="mt-2 flex items-center justify-center gap-2 text-center text-[13px] text-muted">
        <SimulatedBadge /> Marque e receba o aviso do lote
      </p>
    </div>
  )
}
