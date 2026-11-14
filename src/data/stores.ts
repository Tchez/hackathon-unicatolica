import type { Store } from '../types'

// Lojas fictícias.
export function createStores(): Store[] {
  return [
    { id: 'store-techplay', name: 'TechPlay', category: 'Eletrônicos' },
    { id: 'store-cafe-ipe', name: 'Café Ipê', category: 'Café' },
    { id: 'store-livraria-folha', name: 'Livraria Folha', category: 'Livraria' },
    { id: 'store-moda-sol', name: 'Moda Sol', category: 'Moda' },
    { id: 'store-esporte-total', name: 'Esporte Total', category: 'Esportes' },
    { id: 'store-farmacia-vida', name: 'Farmácia Vida', category: 'Saúde' },
  ]
}
