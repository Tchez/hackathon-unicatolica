import { formatCountdown } from '../../../lib/format'
import { useNow } from './useNow'

interface CountdownProps {
  /** Fim da contagem: data ISO ou milissegundos. */
  endsAt: string | number
  className?: string
}

/** Contagem regressiva pelo relógio real, atualizada sozinha; para em 00:00. */
export function Countdown({ endsAt, className = '' }: CountdownProps) {
  const now = useNow()
  const end = typeof endsAt === 'number' ? endsAt : new Date(endsAt).getTime()
  return <span className={`tabular-nums ${className}`}>{formatCountdown(end - now)}</span>
}
