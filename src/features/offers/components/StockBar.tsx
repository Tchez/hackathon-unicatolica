interface StockBarProps {
  remaining: number
  total: number
}

/** Barra de estoque: unidades restantes dos lotes liberados. */
export function StockBar({ remaining, total }: StockBarProps) {
  const percent = total > 0 ? Math.round((remaining / total) * 100) : 0
  return (
    <div className="py-3">
      <div className="mb-2 flex justify-between text-sm">
        <span>
          {remaining} de {total} restantes
        </span>
        <span className="text-muted">{percent}%</span>
      </div>
      <div
        role="progressbar"
        aria-label="Estoque restante"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={remaining}
        className="h-2 overflow-hidden rounded-full bg-surface"
      >
        <div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}
