import { CircleCheck, Clock } from 'lucide-react'
import { useLayoutEffect, useState } from 'react'
import { Link } from 'react-router'
import { SimulatedBadge } from '../../../components/SimulatedBadge'
import { formatCountdown, formatCurrency } from '../../../lib/format'
import { usePointsStore, type GenerateCodeError } from '../pointsStore'
import { outlineButton, primaryButton } from './buttonStyles'
import {
  formatPoints,
  formatPurchaseCode,
  getCodeStatus,
  getLatestCode,
  getProgressSummary,
  getRecentPurchases,
  summarizePurchase,
} from './pointsView'
import { RecentPurchases } from './RecentPurchases'
import { useNow } from './useNow'

const GENERATE_ERRORS: Record<GenerateCodeError, string> = {
  invalid_user: 'Só visitantes comprovam compras. Entre com um usuário visitante.',
}

interface PurchaseCodeScreenProps {
  userId: string
}

/**
 * Comprovar compra: mostra o código do visitante e reage sozinha ao que o store registra, seja a
 * contagem do prazo, o vencimento ou a confirmação feita pelo lojista (inclusive em outra aba).
 */
export function PurchaseCodeScreen({ userId }: PurchaseCodeScreenProps) {
  const purchaseCodes = usePointsStore((state) => state.purchaseCodes)
  const purchases = usePointsStore((state) => state.purchases)
  const entries = usePointsStore((state) => state.entries)
  const coupons = usePointsStore((state) => state.coupons)
  const balance = usePointsStore((state) => state.getBalance(userId))
  const generatePurchaseCode = usePointsStore((state) => state.generatePurchaseCode)
  const now = useNow()
  const [error, setError] = useState<string | null>(null)

  // Ao abrir a tela, usa o código ainda válido ou gera um novo. Reaproveitar o válido evita um
  // código novo a cada visita (e a duplicata que o modo estrito do React criaria). Roda antes da
  // pintura para não piscar a confirmação de uma compra antiga.
  useLayoutEffect(() => {
    const state = usePointsStore.getState()
    const latest = getLatestCode(state.purchaseCodes, userId)
    if (latest && getCodeStatus(latest, Date.now()) === 'active') return
    // Só falha para quem não é visitante, caso que a página já trata antes de chegar aqui.
    state.generatePurchaseCode(userId)
  }, [userId])

  const generate = () => {
    const result = generatePurchaseCode(userId)
    setError(result.ok ? null : GENERATE_ERRORS[result.error])
  }

  const latest = getLatestCode(purchaseCodes, userId)
  const status = latest ? getCodeStatus(latest, now) : undefined
  const confirmed =
    latest && status === 'used'
      ? purchases.find((purchase) => purchase.purchaseCode === latest.code)
      : undefined
  const summary = confirmed ? summarizePurchase(confirmed, entries) : undefined
  const progress = getProgressSummary(coupons, userId, balance)
  const recent = getRecentPurchases(purchases, entries, userId)

  return (
    <section className="mx-auto w-full max-w-xl px-4 py-6">
      <h1 className="text-xl font-semibold">Comprovar compra</h1>

      {error && (
        <p role="alert" className="mt-4 rounded-card bg-primary-soft p-3 text-sm text-primary-dark">
          {error}
        </p>
      )}

      {status === 'used' && (
        <div className="mt-4">
          <div role="status" className="rounded-card bg-green-soft p-4">
            <p className="flex items-center gap-2 text-lg font-semibold text-green">
              <CircleCheck aria-hidden className="size-6" />
              Compra confirmada
            </p>
            {summary && (
              <>
                <p className="mt-3">
                  {summary.storeName} · {formatCurrency(summary.amountCents)}
                </p>
                <p className="mt-1 text-3xl font-bold text-green">+{formatPoints(summary.points)} pontos</p>
                {summary.bonusPoints > 0 && (
                  <p className="mt-1 font-semibold text-green">
                    +{formatPoints(summary.bonusPoints)} pontos de bônus de indicação
                  </p>
                )}
              </>
            )}
            <p className="mt-3 text-sm text-muted">
              Saldo: {formatPoints(balance)} pontos. {progress.title}.
            </p>
          </div>
          <Link to="/visitor/points" className={`${primaryButton} mt-3`}>
            Ver meus pontos
          </Link>
          <button type="button" onClick={generate} className={`${outlineButton} mt-3`}>
            Gerar novo código
          </button>
        </div>
      )}

      {status === 'expired' && (
        <div className="mt-4">
          <div role="status" className="rounded-card bg-primary-soft p-4 text-primary-dark">
            <p className="text-lg font-semibold">Código vencido</p>
            <p className="mt-1 text-sm">Esse código não vale mais. Gere um novo para informar no caixa.</p>
          </div>
          <button type="button" onClick={generate} className={`${primaryButton} mt-3`}>
            Gerar novo código
          </button>
        </div>
      )}

      {status !== 'used' && status !== 'expired' && (
        <div className="mt-4">
          <div className="rounded-card bg-surface px-3 py-6 text-center">
            <p
              aria-label={latest ? `Código ${latest.code.split('').join(' ')}` : 'Gerando o código'}
              className="text-5xl font-bold tabular-nums tracking-widest"
            >
              {latest ? formatPurchaseCode(latest.code) : '••• •••'}
            </p>
            {latest && (
              <div
                role="timer"
                className="mt-3 flex flex-wrap items-center justify-center gap-2 text-sm text-muted"
              >
                <Clock aria-hidden className="size-4.5 text-primary" />
                <span>
                  Válido por{' '}
                  <span className="font-semibold tabular-nums text-text">
                    {formatCountdown(new Date(latest.expiresAt).getTime() - now)}
                  </span>
                </span>
                <SimulatedBadge variant="illustrative" />
              </div>
            )}
          </div>
          <p className="mt-4 leading-relaxed">
            Informe este código no caixa. O lojista confirma o valor e seus pontos caem na hora.
          </p>
        </div>
      )}

      <RecentPurchases items={recent} />
    </section>
  )
}
