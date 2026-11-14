import { useEffect } from 'react'
import { SimulatedBadge } from '../../../components/SimulatedBadge'
import { COUPON_VALIDITY_MINUTES } from '../../../config/business-rules'
import type { Reward } from '../../../types'
import { outlineButton, primaryButton } from './buttonStyles'
import { IconBox } from './IconBox'
import { formatPoints, getRewardTone } from './pointsView'
import { getRewardDetails } from './rewardIcons'

interface RedeemDialogProps {
  reward: Reward
  balance: number
  /** Mensagem do erro devolvido pela troca, se houve. */
  error: string | null
  onConfirm: () => void
  onClose: () => void
}

/** Confirmação da troca: mostra o saldo antes e depois, e só então troca os pontos. */
export function RedeemDialog({ reward, balance, error, onConfirm, onClose }: RedeemDialogProps) {
  const details = getRewardDetails(reward.kind)

  // Esc fecha a confirmação, como em qualquer janela.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-20 flex items-end justify-center bg-text/50 sm:items-center"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="redeem-title"
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-md rounded-t-card bg-background p-4 sm:rounded-card"
      >
        <h2 id="redeem-title" className="text-lg font-semibold">
          Confirmar troca
        </h2>
        <div className="mt-3 flex items-center gap-3">
          <IconBox icon={details.icon} tone={getRewardTone(reward)} />
          <div className="min-w-0 flex-1">
            <p className="flex flex-wrap items-center gap-2 font-semibold">
              {reward.title}
              {reward.kind === 'parking' && <SimulatedBadge />}
            </p>
            <p className="text-sm text-muted">{details.description}</p>
          </div>
        </div>

        <dl className="mt-4 text-sm">
          <div className="flex justify-between border-b border-line py-2">
            <dt>Saldo atual</dt>
            <dd className="tabular-nums">{formatPoints(balance)} pontos</dd>
          </div>
          <div className="flex justify-between border-b border-line py-2">
            <dt>Custo</dt>
            <dd className="tabular-nums">{formatPoints(reward.pointsCost)} pontos</dd>
          </div>
          <div className="flex justify-between py-2 font-semibold">
            <dt>Saldo após a troca</dt>
            <dd className="text-primary tabular-nums">
              {formatPoints(Math.max(0, balance - reward.pointsCost))} pontos
            </dd>
          </div>
        </dl>
        <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted">
          Vira um cupom válido por {COUPON_VALIDITY_MINUTES} min, em Meus cupons.
          <SimulatedBadge variant="illustrative" />
        </p>

        {error && (
          <p role="alert" className="mt-3 rounded-card bg-primary-soft p-3 text-sm text-primary-dark">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={onConfirm}
          disabled={error !== null}
          className={`${primaryButton} mt-4`}
        >
          Confirmar troca
        </button>
        <button type="button" autoFocus onClick={onClose} className={`${outlineButton} mt-2`}>
          {error ? 'Fechar' : 'Cancelar'}
        </button>
      </div>
    </div>
  )
}
