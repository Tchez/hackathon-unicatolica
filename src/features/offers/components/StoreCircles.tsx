import { useOffersStore } from '../offersStore'
import { getStoreVisual } from './storeVisual'

interface StoreCirclesProps {
  /** Toque numa loja: o diretório de lojas está fora do protótipo. */
  onSelect: () => void
}

/** Lojas em círculos, com o ícone da categoria (as lojas são fictícias). */
export function StoreCircles({ onSelect }: StoreCirclesProps) {
  const stores = useOffersStore((state) => state.stores)
  return (
    <ul className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 [scrollbar-width:none] lg:mx-0 lg:grid lg:grid-cols-6 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden">
      {stores.map((store) => {
        const { icon: Icon, tone } = getStoreVisual(store)
        return (
          <li key={store.id} className="w-35 flex-none snap-start lg:w-auto">
            <button
              type="button"
              onClick={onSelect}
              className="flex min-h-11 w-full flex-col items-center gap-2 rounded-card bg-surface p-3 text-center"
            >
              <span className={`flex size-13 items-center justify-center rounded-full ${tone}`}>
                <Icon aria-hidden className="size-6" />
              </span>
              <span className="text-sm leading-tight font-semibold">{store.name}</span>
              <span className="line-clamp-2 text-xs leading-snug text-muted">{store.slogan}</span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
