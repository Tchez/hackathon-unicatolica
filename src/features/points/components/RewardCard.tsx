import { SimulatedBadge } from '../../../components/SimulatedBadge'
import type { Reward } from '../../../types'
import { CoinIcon } from './CoinIcon'
import { IconBox } from './IconBox'
import { formatPoints, getRewardTone, type RewardAvailability } from './pointsView'
import { getRewardDetails } from './rewardIcons'

interface RewardCardProps {
  reward: Reward
  availability: RewardAvailability
  onSelect: (reward: Reward) => void
}

function describeAvailability(reward: Reward, availability: RewardAvailability): string {
  if (availability.status === 'limit') {
    return `Limite atingido: ${reward.limit} ${reward.limit === 1 ? 'troca' : 'trocas'} por pessoa`
  }
  if (availability.status === 'insufficient') return `Faltam ${formatPoints(availability.missing)} pontos`
  return getRewardDetails(reward.kind).description
}

/** Recompensa da troca de pontos; fica desabilitada, com o motivo, sem saldo ou no limite. */
export function RewardCard({ reward, availability, onSelect }: RewardCardProps) {
  const disabled = availability.status !== 'available'
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onSelect(reward)}
      className="flex min-h-17 w-full items-center gap-3 border-b border-line py-3 text-left disabled:opacity-60"
    >
      <IconBox icon={getRewardDetails(reward.kind).icon} tone={getRewardTone(reward)} />
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2 font-semibold">
          {reward.title}
          {reward.kind === 'parking' && <SimulatedBadge />}
        </span>
        <span className={`block text-sm ${disabled ? 'font-medium text-primary-dark' : 'text-muted'}`}>
          {describeAvailability(reward, availability)}
        </span>
      </span>
      <span className="flex shrink-0 items-center gap-1 text-sm font-semibold text-primary tabular-nums">
        <CoinIcon className="size-4" />
        {formatPoints(reward.pointsCost)}
        <span className="sr-only">pontos</span>
      </span>
    </button>
  )
}
