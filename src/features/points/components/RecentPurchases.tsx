import { Store } from 'lucide-react'
import { formatCurrency, formatDate } from '../../../lib/format'
import { IconBox } from './IconBox'
import { formatPoints, type PurchaseSummary } from './pointsView'

interface RecentPurchasesProps {
  items: PurchaseSummary[]
}

/** Compras comprovadas mais recentes: loja, valor e pontos ganhos. */
export function RecentPurchases({ items }: RecentPurchasesProps) {
  return (
    <section aria-labelledby="recent-purchases" className="mt-8">
      <h2 id="recent-purchases" className="text-base font-semibold">
        Compras recentes
      </h2>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-muted">Suas compras comprovadas aparecem aqui.</p>
      ) : (
        <ul className="mt-2">
          {items.map((item) => (
            <li key={item.id} className="flex min-h-16 items-center gap-3 border-b border-line py-2">
              <IconBox icon={Store} tone="brown" className="size-10" />
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{item.storeName}</p>
                <p className="text-sm text-muted">
                  {formatCurrency(item.amountCents)} · {formatDate(item.createdAt)}
                </p>
              </div>
              <span className="shrink-0 font-semibold text-green">+{formatPoints(item.points)} pontos</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
