import { useSyncExternalStore } from 'react'

// Um único relógio para todas as contagens da tela: roda enquanto houver quem o use.
const listeners = new Set<() => void>()
let timer: ReturnType<typeof setInterval> | undefined

function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  if (listeners.size === 1) timer = setInterval(() => listeners.forEach((notify) => notify()), 250)
  return () => {
    listeners.delete(listener)
    if (listeners.size === 0) clearInterval(timer)
  }
}

// Em segundos cheios: o valor só muda uma vez por segundo, então só então a tela se redesenha.
function getSnapshot(): number {
  return Math.floor(Date.now() / 1000) * 1000
}

/** Relógio real do aparelho, atualizado sozinho (ms, em segundos cheios). */
export function useNow(): number {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}
