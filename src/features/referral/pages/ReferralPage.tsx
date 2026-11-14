import { Gift } from 'lucide-react'
import { SimulatedBadge } from '../../../components/SimulatedBadge'
import { REFERRAL_BONUS_POINTS } from '../../../config/business-rules'
import { useAccountStore, useCurrentUser } from '../../account/accountStore'
import { ReferralCode } from '../components/ReferralCode'
import { ReferralList } from '../components/ReferralList'
import { buildReceivedReferralText, buildReferralRule } from '../components/referralText'
import { useReferralStore } from '../referralStore'

/** Indicar (J6): código pessoal, regra do bônus, indicações feitas e, se houver, a indicação recebida. */
export function ReferralPage() {
  const user = useCurrentUser()
  const users = useAccountStore((state) => state.users)
  const referrals = useReferralStore((state) => state.referrals)

  if (!user) return null

  const nameOf = (userId: string) => users.find((item) => item.id === userId)?.name ?? 'Visitante'
  const given = referrals.filter((referral) => referral.referrerId === user.id)
  const received = referrals.find((referral) => referral.referredId === user.id)

  return (
    <section className="mx-auto flex w-full max-w-xl flex-col gap-6 px-4 py-6 lg:py-10">
      <div>
        <h1 className="text-xl font-semibold">Indicar amigos</h1>
        <p className="mt-1 text-muted">Bom para você. Bom para quem vem.</p>
      </div>

      <ReferralCode code={user.referralCode} />

      <p className="flex flex-wrap items-center gap-2 rounded-card bg-gold-soft px-4 py-3 text-sm text-gold-dark">
        <span className="font-medium">{buildReferralRule(REFERRAL_BONUS_POINTS)}</span>
        <SimulatedBadge variant="illustrative" />
      </p>

      <section aria-labelledby="referral-list-title">
        <h2 id="referral-list-title" className="mb-3 font-semibold">
          Suas indicações
        </h2>
        <ReferralList referrals={given} nameOf={nameOf} />
      </section>

      {received && (
        <p className="flex items-start gap-3 rounded-card border border-line px-4 py-3 text-sm">
          <Gift aria-hidden className="mt-0.5 size-5 shrink-0 text-primary" />
          {buildReceivedReferralText(nameOf(received.referrerId), received.status, REFERRAL_BONUS_POINTS)}
        </p>
      )}
    </section>
  )
}
