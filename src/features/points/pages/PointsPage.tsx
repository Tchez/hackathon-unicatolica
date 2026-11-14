import { useCallback, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { SimulatedBadge } from '../../../components/SimulatedBadge'
import { REWARDS } from '../../../config/business-rules'
import type { Reward } from '../../../types'
import { useCurrentUser } from '../../account/accountStore'
import { EarnMorePoints } from '../components/EarnMorePoints'
import { PointsHeader } from '../components/PointsHeader'
import { PointsStatement } from '../components/PointsStatement'
import { ProgressCard } from '../components/ProgressCard'
import { RedeemDialog } from '../components/RedeemDialog'
import { RewardCard } from '../components/RewardCard'
import {
  buildStatement,
  countRedeemed,
  getProgressSummary,
  getRewardAvailability,
} from '../components/pointsView'
import { usePointsStore, type RedeemRewardError } from '../pointsStore'

const REDEEM_ERRORS: Record<RedeemRewardError, string> = {
  invalid_user: 'Só visitantes trocam pontos. Entre com um usuário visitante.',
  reward_not_found: 'Esta recompensa não está mais disponível.',
  insufficient_points: 'Saldo insuficiente para esta troca.',
  limit_reached: 'Você já atingiu o limite de trocas desta recompensa.',
}

interface PointsContentProps {
  userId: string
}

function PointsContent({ userId }: PointsContentProps) {
  const navigate = useNavigate()
  const coupons = usePointsStore((state) => state.coupons)
  const purchases = usePointsStore((state) => state.purchases)
  const entries = usePointsStore((state) => state.entries)
  const balance = usePointsStore((state) => state.getBalance(userId))
  const redeemReward = usePointsStore((state) => state.redeemReward)
  const [selected, setSelected] = useState<Reward | null>(null)
  const [error, setError] = useState<string | null>(null)
  const historyRef = useRef<HTMLElement>(null)

  const progress = getProgressSummary(coupons, userId, balance)
  const statement = buildStatement(entries, purchases, coupons, userId)

  const openHistory = () => {
    historyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    historyRef.current?.focus({ preventScroll: true })
  }

  const closeDialog = useCallback(() => {
    setSelected(null)
    setError(null)
  }, [])

  const confirm = () => {
    if (!selected) return
    const result = redeemReward(userId, selected.id)
    if (!result.ok) {
      setError(REDEEM_ERRORS[result.error])
      return
    }
    navigate('/visitor/coupons', { state: { redeemedCouponId: result.value.id } })
  }

  return (
    <div className="mx-auto w-full max-w-xl pb-8">
      <PointsHeader balance={balance} onOpenHistory={openHistory} />
      <ProgressCard balance={balance} progress={progress} />

      <div className="px-4 lg:px-0">
        <section aria-labelledby="rewards" className="mt-8">
          <h2 id="rewards" className="flex flex-wrap items-center gap-2 text-base font-semibold">
            Troque seus pontos
            <SimulatedBadge variant="illustrative" />
          </h2>
          <div className="mt-2">
            {REWARDS.map((reward) => (
              <RewardCard
                key={reward.id}
                reward={reward}
                availability={getRewardAvailability(
                  reward,
                  balance,
                  countRedeemed(coupons, userId, reward.id),
                )}
                onSelect={setSelected}
              />
            ))}
          </div>
        </section>

        <EarnMorePoints />
        <PointsStatement ref={historyRef} rows={statement} />
      </div>

      {selected && (
        <RedeemDialog
          reward={selected}
          balance={balance}
          error={error}
          onConfirm={confirm}
          onClose={closeDialog}
        />
      )}
    </div>
  )
}

export function PointsPage() {
  const user = useCurrentUser()
  // A rota só aceita visitante; sem usuário, o guarda de rota já redirecionou.
  if (!user) return null
  return <PointsContent key={user.id} userId={user.id} />
}
