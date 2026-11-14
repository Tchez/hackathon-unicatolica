import { useEffect } from 'react'

export interface NoticeMessage {
  text: string
  /** Muda a cada aviso, para a contagem de 3 s recomeçar mesmo com o mesmo texto. */
  id: number
}

interface FloatingNoticeProps {
  notice: NoticeMessage | null
  onDone: () => void
}

/** Aviso passageiro no pé da tela (ex.: "Fora do protótipo"); some sozinho depois de 3 s. */
export function FloatingNotice({ notice, onDone }: FloatingNoticeProps) {
  useEffect(() => {
    if (!notice) return
    const timer = setTimeout(onDone, 3000)
    return () => clearTimeout(timer)
  }, [notice, onDone])

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 bottom-6 z-30 flex justify-center"
    >
      {notice && <p className="rounded-card bg-text px-4 py-3 text-sm text-white shadow-lg">{notice.text}</p>}
    </div>
  )
}
