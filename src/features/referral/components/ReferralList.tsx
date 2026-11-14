import { REFERRAL_BONUS_POINTS } from '../../../config/business-rules'
import type { Referral } from '../../../types'
import { REFERRAL_STATUS_LABELS } from './referralText'

interface ReferralListProps {
  /** Indicações feitas pelo usuário logado. */
  referrals: Referral[]
  nameOf: (userId: string) => string
}

/** Lista de quem o usuário indicou, com o status do bônus de cada um. */
export function ReferralList({ referrals, nameOf }: ReferralListProps) {
  if (referrals.length === 0) {
    return (
      <p className="rounded-card bg-surface px-4 py-3 text-sm text-muted">
        Você ainda não indicou ninguém. Compartilhe o seu código para começar.
      </p>
    )
  }

  return (
    <ul className="flex flex-col gap-2">
      {referrals.map((referral) => {
        const rewarded = referral.status === 'rewarded'
        return (
          <li
            key={referral.id}
            className="flex min-h-14 items-center justify-between gap-3 rounded-card border border-line px-4 py-2"
          >
            <span className="font-medium">{nameOf(referral.referredId)}</span>
            <span className="flex flex-col items-end gap-0.5 text-right">
              <span
                className={`rounded-card px-2 py-0.5 text-xs font-semibold ${
                  rewarded ? 'bg-green-soft text-green' : 'bg-gold-soft text-gold-dark'
                }`}
              >
                {REFERRAL_STATUS_LABELS[referral.status]}
              </span>
              {rewarded && (
                <span className="text-xs font-medium text-green">+{REFERRAL_BONUS_POINTS} pontos</span>
              )}
            </span>
          </li>
        )
      })}
    </ul>
  )
}
