import { Cat } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { formatDate } from '../../../lib/format'
import { isFriday13, lastFriday13, nextFriday13 } from './friday13'

const COUPON_SECONDS = 13

interface Friday13OverlayProps {
  onClose: () => void
}

/** Easter Egg: tela de sexta-feira 13 por cima do app. Só lê o relógio; não grava nada. */
export function Friday13Overlay({ onClose }: Friday13OverlayProps) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const [secondsLeft, setSecondsLeft] = useState(COUPON_SECONDS)
  const [dates] = useState(() => {
    const now = Date.now()
    return {
      today: isFriday13(now),
      last: formatDate(lastFriday13(now).toISOString()),
      next: formatDate(nextFriday13(now).toISOString()),
    }
  })

  useEffect(() => {
    closeRef.current?.focus()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  useEffect(() => {
    const startedAt = Date.now()
    const timer = window.setInterval(() => {
      const left = Math.max(0, COUPON_SECONDS - Math.floor((Date.now() - startedAt) / 1000))
      setSecondsLeft(left)
      if (left === 0) window.clearInterval(timer)
    }, 250)
    return () => window.clearInterval(timer)
  }, [])

  const expired = secondsLeft === 0

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="friday13-title"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 overflow-hidden bg-text bg-radial from-primary-dark/60 to-text px-4 text-center text-background motion-safe:animate-fade-in"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-background opacity-0 motion-safe:animate-lightning"
      />

      <Cat aria-hidden className="size-20 text-background motion-safe:animate-bob" />
      <h2 id="friday13-title" className="text-3xl font-bold motion-safe:animate-shake">
        Sexta-feira 13
      </h2>
      <p className="text-background/80">
        {dates.today ? 'Hoje é sexta-feira 13' : `Última: ${dates.last} · Próxima: ${dates.next}`}
      </p>

      <div className="min-h-32 w-full max-w-xs">
        {expired ? (
          <p role="status" className="pt-6 font-semibold">
            O azar passou. Suas ofertas continuam valendo.
          </p>
        ) : (
          <div
            role="status"
            className={`rounded-card border-2 border-primary bg-text p-4 shadow-glow ${secondsLeft <= 1 ? 'motion-safe:animate-fade-out' : 'motion-safe:animate-pulse-slow'}`}
          >
            <p className="text-sm text-gold">Cupom amaldiçoado</p>
            <p className="text-2xl font-bold">13% OFF em tudo</p>
            <p
              className={`mt-1 text-sm tabular-nums ${secondsLeft <= 5 ? 'font-semibold text-primary' : ''}`}
            >
              Some em {secondsLeft} s
            </p>
          </div>
        )}
      </div>

      <p className="text-xs text-background/70">Só de brincadeira: não vale no caixa.</p>
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        className="flex min-h-12 items-center justify-center rounded-card bg-background px-8 font-semibold text-text"
      >
        Fechar
      </button>

      <Cat
        aria-hidden
        className="absolute bottom-6 left-1/2 size-12 -translate-x-1/2 text-background motion-safe:left-0 motion-safe:translate-x-0 motion-safe:animate-cat-walk"
      />
    </div>
  )
}
