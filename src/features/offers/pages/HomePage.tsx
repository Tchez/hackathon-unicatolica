import { ShortcutGrid } from '../../../components/ShortcutGrid'
import { useCurrentUser } from '../../account/accountStore'

/** Início: o carrossel de campanhas entra na spec das telas do visitante; por ora, os atalhos. */
export function HomePage() {
  const user = useCurrentUser()
  return (
    <div>
      <section className="px-4 py-6">
        <h1 className="text-xl font-semibold">{user ? `Olá, ${user.name}` : 'Início'}</h1>
        <p className="mt-2 text-muted">Em construção</p>
      </section>
      <ShortcutGrid />
    </div>
  )
}
