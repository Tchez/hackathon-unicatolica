import { useEffect, useState } from 'react'

/** Relógio real em ms, atualizado a cada `intervalMs`, para contagens e estados ao vivo. */
export function useNow(intervalMs = 1000): number {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), intervalMs)
    return () => window.clearInterval(id)
  }, [intervalMs])
  return now
}
