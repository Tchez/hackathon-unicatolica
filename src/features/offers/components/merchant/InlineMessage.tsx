import { CircleAlert, CircleCheck, Info, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

export type MessageTone = 'success' | 'error' | 'info'

const TONES: Record<MessageTone, { box: string; icon: LucideIcon }> = {
  success: { box: 'bg-green text-white', icon: CircleCheck },
  error: { box: 'bg-primary-soft text-primary-dark', icon: CircleAlert },
  info: { box: 'bg-gold-soft text-text', icon: Info },
}

interface InlineMessageProps {
  tone: MessageTone
  children: ReactNode
}

/** Aviso dentro da tela: verde para sucesso, ferrugem para erro, dourado para informação. */
export function InlineMessage({ tone, children }: InlineMessageProps) {
  const { box, icon: Icon } = TONES[tone]
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={`flex items-start gap-2.5 rounded-card p-3.5 text-sm leading-snug font-medium ${box}`}
    >
      <Icon aria-hidden className="mt-px size-5 flex-none" />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}
