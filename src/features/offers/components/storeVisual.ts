import {
  BookOpen,
  Coffee,
  Cpu,
  Dumbbell,
  Pill,
  Shirt,
  Store as StoreIcon,
  type LucideIcon,
} from 'lucide-react'
import type { Store } from '../../../types'

export interface StoreVisual {
  icon: LucideIcon
  /** Classes de cor (fundo suave e ícone), do tema. */
  tone: string
}

// Ícone e cor por categoria, no lugar do logotipo das lojas (fictícias).
const BY_CATEGORY: Record<string, StoreVisual> = {
  Eletrônicos: { icon: Cpu, tone: 'bg-primary-soft text-primary' },
  Café: { icon: Coffee, tone: 'bg-brown-soft text-brown' },
  Livraria: { icon: BookOpen, tone: 'bg-gold-soft text-gold-dark' },
  Moda: { icon: Shirt, tone: 'bg-green-soft text-green' },
  Esportes: { icon: Dumbbell, tone: 'bg-primary-soft text-primary' },
  Saúde: { icon: Pill, tone: 'bg-green-soft text-green' },
}

const FALLBACK: StoreVisual = { icon: StoreIcon, tone: 'bg-surface text-muted' }

export function getStoreVisual(store: Store | undefined): StoreVisual {
  return (store && BY_CATEGORY[store.category]) || FALLBACK
}
