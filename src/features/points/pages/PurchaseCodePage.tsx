import { useCurrentUser } from '../../account/accountStore'
import { PurchaseCodeScreen } from '../components/PurchaseCodeScreen'

export function PurchaseCodePage() {
  const user = useCurrentUser()
  // A rota só aceita visitante; sem usuário, o guarda de rota já redirecionou.
  if (!user) return null
  return <PurchaseCodeScreen key={user.id} userId={user.id} />
}
