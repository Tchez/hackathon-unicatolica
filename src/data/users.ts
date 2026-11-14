import type { User } from '../types'

// Usuários de exemplo, fictícios e sem senha (RNF03).
export function createUsers(): User[] {
  return [
    { id: 'user-ana', name: 'Ana', role: 'visitor', referralCode: 'ANA100' },
    { id: 'user-bruno', name: 'Bruno', role: 'visitor', referralCode: 'BRUNO100' },
    // Indicada pelo Bruno; ainda sem compra comprovada, então o bônus está pendente.
    { id: 'user-carla', name: 'Carla', role: 'visitor', referralCode: 'CARLA100', referredBy: 'user-bruno' },
    {
      id: 'user-techplay',
      name: 'TechPlay',
      role: 'merchant',
      storeId: 'store-techplay',
      referralCode: 'TECHPLAY1',
    },
    {
      id: 'user-cafe-ipe',
      name: 'Café Ipê',
      role: 'merchant',
      storeId: 'store-cafe-ipe',
      referralCode: 'CAFEIPE1',
    },
    { id: 'user-mall', name: 'Administração do shopping', role: 'mall', referralCode: 'SHOPPING1' },
  ]
}
