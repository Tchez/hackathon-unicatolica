import type { LucideIcon } from 'lucide-react'
import type { Tone } from './pointsView'

// Fundo claro e ícone na cor própria, um par por cor do tema (design §2).
const TONE_CLASSES: Record<Tone, string> = {
  primary: 'bg-primary-soft text-primary',
  green: 'bg-green-soft text-green',
  gold: 'bg-gold-soft text-gold-dark',
  brown: 'bg-brown-soft text-brown',
}

interface IconBoxProps {
  icon: LucideIcon
  tone: Tone
  className?: string
}

/** Quadrado com ícone, como nos atalhos e nas listas do app. */
export function IconBox({ icon: Icon, tone, className = 'size-12' }: IconBoxProps) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-card ${TONE_CLASSES[tone]} ${className}`}
    >
      <Icon aria-hidden className="size-6" />
    </span>
  )
}
