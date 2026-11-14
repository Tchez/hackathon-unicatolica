import type { NoticeMessage } from '../features/offers/components/FloatingNotice'

// Aviso que sobrevive à troca de tela (ex.: "Conta criada" ao voltar do /login). Fica fora do state da
// navegação porque o login redireciona pela guarda da rota antes do `navigate`, e o state se perderia.
let current: NoticeMessage | null = null
let noticeCount = 0
const listeners = new Set<() => void>()

function emit(): void {
  listeners.forEach((listener) => listener())
}

/** Mostra um aviso flutuante que continua visível na próxima tela. */
export function showRouteNotice(text: string): void {
  current = { text, id: ++noticeCount }
  emit()
}

export function clearRouteNotice(): void {
  current = null
  emit()
}

export function subscribeRouteNotice(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function getRouteNotice(): NoticeMessage | null {
  return current
}
