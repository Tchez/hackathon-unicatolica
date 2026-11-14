import { useEffect, useState } from 'react'

/** Relógio real do aparelho, atualizado sozinho (1 s por padrão), para contagens que andam sem recarregar. */
export function useNow(intervalMs = 1000): number {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), intervalMs)
    return () => window.clearInterval(id)
  }, [intervalMs])
  return now
}
