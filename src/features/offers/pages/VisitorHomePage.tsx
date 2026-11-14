import { ShortcutGrid } from '../../../components/ShortcutGrid'
import { useCurrentUser } from '../../account/accountStore'

export function VisitorHomePage() {
  const user = useCurrentUser()
  return (
    <div>
      <section className="px-4 py-6">
        <h1 className="text-xl font-semibold">Início do visitante</h1>
        <p className="mt-2 text-muted">{user ? `Olá, ${user.name}. ` : ''}Em construção</p>
      </section>
      <ShortcutGrid />
    </div>
  )
}
