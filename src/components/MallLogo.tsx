import { useState } from 'react'
import { mall } from '../config/mall'

interface MallLogoProps {
  /** Logo em branco, para fundo escuro. */
  onDark?: boolean
  className?: string
}

/** Logo do shopping, carregada do link remoto; sem rede, mostra o nome. */
export function MallLogo({ onDark = false, className = 'h-8' }: MallLogoProps) {
  const [failed, setFailed] = useState(false)
  if (failed) return <span className="text-base font-semibold text-primary">{mall.name}</span>
  return (
    <img
      src={mall.logoUrl}
      alt={mall.name}
      className={`${className} w-auto ${onDark ? 'brightness-0 invert' : ''}`}
      onError={() => setFailed(true)}
    />
  )
}
