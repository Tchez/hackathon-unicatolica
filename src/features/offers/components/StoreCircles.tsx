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
    <ul className="-mx-4 flex gap-3 overflow-x-auto px-4 [scrollbar-width:none] lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden">
      {stores.map((store) => {
        const { icon: Icon, tone } = getStoreVisual(store)
        return (
          <li key={store.id} className="flex-none">
            <button
              type="button"
              onClick={onSelect}
              className="flex min-h-11 w-20 flex-col items-center gap-1.5 text-center text-xs leading-tight"
            >
              <span className={`flex size-13 items-center justify-center rounded-full ${tone}`}>
                <Icon aria-hidden className="size-6" />
              </span>
              {store.name}
            </button>
          </li>
        )
      })}
    </ul>
  )
}
