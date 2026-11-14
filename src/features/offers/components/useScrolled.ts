import { useSyncExternalStore } from 'react'

function subscribe(notify: () => void): () => void {
  window.addEventListener('scroll', notify, { passive: true })
  return () => window.removeEventListener('scroll', notify)
}

function getSnapshot(): boolean {
  return window.scrollY > 8
}

/** Verdadeiro quando a página já rolou: o topo da tela inicial deixa de ser transparente. */
export function useScrolled(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot)
}
