import { Copy, Share2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { SimulatedBadge } from '../../../components/SimulatedBadge'
import { mall } from '../../../config/mall'
import { REFERRAL_BONUS_POINTS } from '../../../config/business-rules'
import { copyText } from './copyText'
import { buildShareText } from './referralText'

interface ReferralCodeProps {
  code: string
}

const actionClass = 'flex min-h-12 items-center justify-center gap-2 rounded-card px-4 text-base font-medium'

/** Código pessoal com "Copiar" e "Compartilhar" (Web Share API quando existir; senão copia a mensagem). */
export function ReferralCode({ code }: ReferralCodeProps) {
  const [feedback, setFeedback] = useState<string | null>(null)

  useEffect(() => {
    if (!feedback) return
    const timer = window.setTimeout(() => setFeedback(null), 3000)
    return () => window.clearTimeout(timer)
  }, [feedback])

  const copyCode = async () => {
    setFeedback(
      (await copyText(code)) ? 'Código copiado.' : `Não foi possível copiar. Anote o código: ${code}`,
    )
  }

  const share = async () => {
    const text = buildShareText(code, mall.name, REFERRAL_BONUS_POINTS)
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: 'Fidelidade Shopping', text })
        return
      } catch (error) {
        // Quem fecha a folha de compartilhamento não quer a mensagem copiada.
        if (error instanceof DOMException && error.name === 'AbortError') return
      }
    }
    setFeedback(
      (await copyText(text))
        ? 'Mensagem copiada: cole no app de mensagens para convidar.'
        : `Não foi possível copiar. Anote o código: ${code}`,
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-card bg-primary-soft px-4 py-5 text-center">
        <p className="text-sm text-muted">Seu código pessoal</p>
        <p className="mt-1 text-3xl font-bold tracking-widest text-primary-dark">{code}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button type="button" onClick={() => void copyCode()} className={`${actionClass} border border-line`}>
          <Copy aria-hidden className="size-5" />
          Copiar
        </button>
        <button type="button" onClick={() => void share()} className={`${actionClass} bg-primary text-white`}>
          <Share2 aria-hidden className="size-5" />
          Compartilhar
        </button>
      </div>

      <p role="status" className="min-h-5 text-sm font-medium text-primary-dark">
        {feedback}
      </p>

      <p className="flex flex-wrap items-center gap-2 text-xs text-muted">
        <SimulatedBadge /> O app não envia convites: você compartilha o texto.
      </p>
    </div>
  )
}
