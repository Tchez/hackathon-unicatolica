import { SimulatedBadge } from '../../../components/SimulatedBadge'
import { CENTS_PER_POINT } from '../../../config/business-rules'
import { formatCurrency } from '../../../lib/format'
import { CoinIcon } from './CoinIcon'
import { formatPoints } from './pointsView'

interface PointsHeaderProps {
  balance: number
  onOpenHistory: () => void
}

/** Topo da tela de pontos: um único degradê ferrugem → dourado do título ao botão "Histórico". */
export function PointsHeader({ balance, onOpenHistory }: PointsHeaderProps) {
  return (
    <div className="bg-linear-160 from-primary to-gold px-4 pt-5 pb-6 text-white lg:mt-6 lg:rounded-card">
      <h1 className="text-base font-semibold">Meus pontos</h1>
      <p className="mt-2 flex items-center gap-3">
        <CoinIcon className="size-11" />
        <span className="text-5xl leading-none font-bold tabular-nums">{formatPoints(balance)}</span>
        <span className="sr-only">pontos</span>
      </p>
      <p className="mt-3 flex flex-wrap items-center gap-2 text-sm">
        1 ponto a cada {formatCurrency(CENTS_PER_POINT)} em compras
        <SimulatedBadge variant="illustrative" />
      </p>
      <button
        type="button"
        onClick={onOpenHistory}
        className="mt-4 inline-flex min-h-11 items-center rounded-full border-2 border-white px-6 font-semibold"
      >
        Histórico
      </button>
    </div>
  )
}
