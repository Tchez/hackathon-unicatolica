import { formatPoints, type ProgressSummary } from './pointsView'

interface ProgressCardProps {
  balance: number
  progress: ProgressSummary
}

/** Quanto falta para a próxima recompensa, com barra de progresso. */
export function ProgressCard({ balance, progress }: ProgressCardProps) {
  return (
    <div className="mx-4 mt-3 rounded-card border border-line bg-background p-4 lg:mx-0">
      <p className="font-semibold">{progress.title}</p>
      <div
        role="progressbar"
        aria-label="Progresso até a próxima recompensa"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress.percent}
        className="mt-3 h-2 overflow-hidden rounded-full bg-line"
      >
        <div className="h-full rounded-full bg-gold" style={{ width: `${progress.percent}%` }} />
      </div>
      {progress.goal !== undefined && (
        <div className="mt-1.5 flex justify-between text-xs text-muted tabular-nums">
          <span>{formatPoints(balance)}</span>
          <span>{formatPoints(progress.goal)}</span>
        </div>
      )}
    </div>
  )
}
