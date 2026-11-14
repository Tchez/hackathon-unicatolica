import type { Ref } from 'react'
import { formatDate } from '../../../lib/format'
import { formatSignedPoints, type StatementRow } from './pointsView'

interface PointsStatementProps {
  rows: StatementRow[]
  ref?: Ref<HTMLElement>
}

/** Extrato: data, descrição e pontos (ganhos em verde, trocas em ferrugem). */
export function PointsStatement({ rows, ref }: PointsStatementProps) {
  return (
    <section
      ref={ref}
      tabIndex={-1}
      aria-labelledby="points-history"
      className="mt-8 scroll-mt-20 outline-none"
    >
      <h2 id="points-history" className="text-base font-semibold">
        Histórico
      </h2>
      {rows.length === 0 ? (
        <p className="mt-3 text-sm text-muted">Seus pontos ganhos e trocados aparecem aqui.</p>
      ) : (
        <ul className="mt-2">
          {rows.map((row) => (
            <li key={row.id} className="flex min-h-14 items-center gap-3 border-b border-line py-2">
              <div className="min-w-0 flex-1">
                <p className="font-medium">{row.description}</p>
                <p className="text-sm text-muted">{formatDate(row.createdAt, true)}</p>
              </div>
              <span
                className={`shrink-0 font-semibold tabular-nums ${row.points < 0 ? 'text-primary' : 'text-green'}`}
              >
                {formatSignedPoints(row.points)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
