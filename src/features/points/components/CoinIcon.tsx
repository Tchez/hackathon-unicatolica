interface CoinIconProps {
  className?: string
}

/** Moeda dourada dos pontos. */
export function CoinIcon({ className = 'size-6' }: CoinIconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <circle cx="12" cy="12" r="10" className="fill-gold" />
      <circle cx="12" cy="12" r="7" strokeWidth="1.6" className="fill-none stroke-white" />
      <path d="M11 7h2v10h-2z" className="fill-white" />
    </svg>
  )
}
