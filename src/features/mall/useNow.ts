import { useCallback, useEffect, useState } from 'react'

interface NowClock {
  /** Relógio real, em ms, atualizado sozinho. */
  now: number
  /** Atualiza o relógio na hora, por exemplo logo depois de uma ação que usa `Date.now()`. */
  refresh: () => void
}

/** Relógio real para as contagens regressivas: atualiza a cada `intervalMs` (1 s) e limpa o timer ao sair. */
export function useNow(intervalMs = 1000): NowClock {
  const [now, setNow] = useState(() => Date.now())
  const refresh = useCallback(() => setNow(Date.now()), [])

  useEffect(() => {
    const timer = window.setInterval(refresh, intervalMs)
    return () => window.clearInterval(timer)
  }, [intervalMs, refresh])

  return { now, refresh }
}
