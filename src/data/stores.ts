import type { Store } from '../types'

// Lojas fictícias.
export function createStores(): Store[] {
  return [
    { id: 'store-techplay', name: 'TechPlay', category: 'Eletrônicos', slogan: 'Tecnologia que diverte' },
    { id: 'store-cafe-ipe', name: 'Café Ipê', category: 'Café', slogan: 'Café do cerrado, feito na hora' },
    {
      id: 'store-livraria-folha',
      name: 'Livraria Folha',
      category: 'Livraria',
      slogan: 'Uma história em cada página',
    },
    { id: 'store-moda-sol', name: 'Moda Sol', category: 'Moda', slogan: 'Moda leve para dias de sol' },
    {
      id: 'store-esporte-total',
      name: 'Esporte Total',
      category: 'Esportes',
      slogan: 'Seu treino começa aqui',
    },
    { id: 'store-farmacia-vida', name: 'Farmácia Vida', category: 'Saúde', slogan: 'Cuidado perto de você' },
  ]
}
