import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { sessionJSONStorage, storageKey } from '../../lib/storage'

interface SessionState {
  currentUserId: string | null
}

// Sessão no sessionStorage: cada aba tem a sua e não é sincronizada.
export const useSessionStore = create<SessionState>()(
  persist((): SessionState => ({ currentUserId: null }), {
    name: storageKey('session'),
    storage: sessionJSONStorage,
  }),
)
