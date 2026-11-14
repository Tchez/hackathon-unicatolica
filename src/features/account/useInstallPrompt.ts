import { useSyncExternalStore } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
}

// O navegador dispara `beforeinstallprompt` uma vez, logo depois de carregar a página, bem antes de a
// pessoa abrir o perfil. Por isso o evento é capturado aqui, no carregamento do módulo, e não só quando
// a tela do perfil monta.
let deferredPrompt: BeforeInstallPromptEvent | null = null
const listeners = new Set<() => void>()

function setDeferredPrompt(event: BeforeInstallPromptEvent | null): void {
  deferredPrompt = event
  listeners.forEach((listener) => listener())
}

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault()
    setDeferredPrompt(event as BeforeInstallPromptEvent)
  })
  window.addEventListener('appinstalled', () => setDeferredPrompt(null))
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

const getSnapshot = (): BeforeInstallPromptEvent | null => deferredPrompt
const getServerSnapshot = (): null => null

/** Instalação do PWA: `install` só existe quando o navegador oferece a instalação. */
export function useInstallPrompt(): { install: (() => Promise<void>) | null } {
  const event = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  if (!event) return { install: null }
  return {
    install: async () => {
      try {
        await event.prompt()
      } finally {
        // O evento aceita um único `prompt()`: depois dele a oferta some, aceita a pessoa ou não.
        setDeferredPrompt(null)
      }
    },
  }
}
