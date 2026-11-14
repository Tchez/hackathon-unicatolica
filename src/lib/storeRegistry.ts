// Registro dos stores persistidos: sincroniza as abas pelo evento `storage` e
// permite restaurar todos os dados de demonstração sem dependência circular entre módulos.

interface RegisteredStore {
  storageKey: string
  rehydrate: () => void | Promise<void>
  reset: () => void
}

const registry: RegisteredStore[] = []
let listening = false

function listen(): void {
  if (listening || typeof window === 'undefined') return
  listening = true
  // O evento só dispara nas outras abas, que reidratam o store com o que a primeira gravou.
  window.addEventListener('storage', (event) => {
    for (const store of registry) {
      if (event.key === null || event.key === store.storageKey) void store.rehydrate()
    }
  })
}

/** O persist só grava no primeiro `setState`: sem isso, cada recarga gera outro seed relativo ao horário. */
function seedIfEmpty(store: RegisteredStore): void {
  if (typeof window === 'undefined') return
  try {
    if (window.localStorage.getItem(store.storageKey) === null) store.reset()
  } catch {
    // Armazenamento indisponível (modo privado): segue com o seed em memória.
  }
}

export function registerStore(store: RegisteredStore): void {
  registry.push(store)
  listen()
  seedIfEmpty(store)
}

/** Volta todos os stores registrados aos dados simulados iniciais. */
export function resetAllStores(): void {
  for (const store of registry) store.reset()
}
