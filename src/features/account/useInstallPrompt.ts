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

/** App já aberto como instalado (PWA em tela cheia, ou "Adicionar à Tela de Início" no iOS). */
export function isStandalone(): boolean {
  if (typeof window === 'undefined') return false
  const iosStandalone = (navigator as Navigator & { standalone?: boolean }).standalone === true
  return iosStandalone || window.matchMedia('(display-mode: standalone)').matches
}

/** iPhone, iPad e iPod: o Safari do iOS nunca dispara `beforeinstallprompt`. */
export function isIos(): boolean {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent
  // iPadOS se apresenta como Mac; o toque o denuncia. Emuladores de Android em Mac também têm toque.
  const iPadOnMac = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1 && !/Android/.test(ua)
  return /iPhone|iPad|iPod/.test(ua) || iPadOnMac
}

interface InstallPrompt {
  /** Só existe quando o navegador oferece a instalação e o app ainda não está instalado. */
  install: (() => Promise<void>) | null
  /** iOS fora do modo instalado: mostra a instrução manual no lugar do botão. */
  showIosHint: boolean
}

export function useInstallPrompt(): InstallPrompt {
  const event = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  if (isStandalone()) return { install: null, showIosHint: false }
  return {
    install: event
      ? async () => {
          try {
            await event.prompt()
          } catch {
            // Sem o prompt (ex.: já usado ou bloqueado), a oferta some e não há o que tratar.
          } finally {
            // O evento aceita um único `prompt()`: depois dele a oferta some, aceita a pessoa ou não.
            setDeferredPrompt(null)
          }
        }
      : null,
    showIosHint: isIos(),
  }
}
