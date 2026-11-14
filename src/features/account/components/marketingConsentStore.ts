import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { localJSONStorage, storageKey } from '../../../lib/storage'
import { registerStore } from '../../../lib/storeRegistry'

interface MarketingConsentState {
  /** Consentimento de marketing por id de usuário. Quem não aparece aqui não consentiu (RNF05). */
  marketing: Record<string, boolean>
  setMarketing: (userId: string, consent: boolean) => void
}

// Consentimento específico para marketing, separado do uso do app (RNF05). Fica em store próprio
// porque o `User` do modelo não guarda esse dado; registrado para valer o "Restaurar dados".
export const useMarketingConsentStore = create<MarketingConsentState>()(
  persist(
    (set) => ({
      marketing: {},
      setMarketing: (userId, consent) =>
        set((state) => ({ marketing: { ...state.marketing, [userId]: consent } })),
    }),
    {
      name: storageKey('marketing-consent'),
      storage: localJSONStorage,
      partialize: (state) => ({ marketing: state.marketing }),
    },
  ),
)

registerStore({
  storageKey: storageKey('marketing-consent'),
  rehydrate: () => useMarketingConsentStore.persist.rehydrate(),
  reset: () => useMarketingConsentStore.setState({ marketing: {} }),
})

/** Se o usuário consentiu em receber marketing; desligado por padrão. */
export function useMarketingConsent(userId: string): boolean {
  return useMarketingConsentStore((state) => state.marketing[userId] ?? false)
}
