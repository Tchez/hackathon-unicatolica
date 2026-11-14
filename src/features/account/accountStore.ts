import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createUsers } from '../../data/users'
import { localJSONStorage, storageKey } from '../../lib/storage'
import { registerStore, resetAllStores } from '../../lib/storeRegistry'
import type { User } from '../../types'
import { useSessionStore } from './sessionStore'

interface AccountState {
  users: User[]
  /** Entra como um usuário de exemplo, sem senha. Falso se o usuário não existe. */
  login: (userId: string) => boolean
  logout: () => void
  /** Zera todos os stores para os dados simulados iniciais e encerra a sessão desta aba. */
  restoreDemoData: () => void
  /** Uso interno do store de indicação. */
  setReferredBy: (userId: string, referrerId: string) => void
}

export const useAccountStore = create<AccountState>()(
  persist(
    (set, get) => ({
      users: createUsers(),
      login: (userId) => {
        if (!get().users.some((user) => user.id === userId)) return false
        useSessionStore.setState({ currentUserId: userId })
        return true
      },
      logout: () => useSessionStore.setState({ currentUserId: null }),
      restoreDemoData: () => {
        resetAllStores()
        useSessionStore.setState({ currentUserId: null })
      },
      setReferredBy: (userId, referrerId) =>
        set((state) => ({
          users: state.users.map((user) => (user.id === userId ? { ...user, referredBy: referrerId } : user)),
        })),
    }),
    {
      name: storageKey('account'),
      storage: localJSONStorage,
      partialize: (state) => ({ users: state.users }),
    },
  ),
)

registerStore({
  storageKey: storageKey('account'),
  rehydrate: () => useAccountStore.persist.rehydrate(),
  reset: () => useAccountStore.setState({ users: createUsers() }),
})

/** Busca um usuário pelo id, fora de componentes. */
export function getUser(userId: string): User | undefined {
  return useAccountStore.getState().users.find((user) => user.id === userId)
}

/** Usuário logado nesta aba, ou undefined no modo sem login. */
export function useCurrentUser(): User | undefined {
  const currentUserId = useSessionStore((state) => state.currentUserId)
  const users = useAccountStore((state) => state.users)
  return users.find((user) => user.id === currentUserId)
}
