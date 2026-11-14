import { createJSONStorage } from 'zustand/middleware'

/** Prefixo de todas as chaves de armazenamento do app. */
export const STORAGE_PREFIX = 'fidelidade:'

export function storageKey(name: string): string {
  return `${STORAGE_PREFIX}${name}`
}

/** Dados compartilhados entre as abas do navegador. */
export const localJSONStorage = createJSONStorage(() => localStorage)

/** Sessão: uma por aba. */
export const sessionJSONStorage = createJSONStorage(() => sessionStorage)
