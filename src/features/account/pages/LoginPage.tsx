import { UserPicker } from '../components/UserPicker'

export function LoginPage() {
  return (
    <section className="px-4 py-6">
      <h1 className="mb-4 text-xl font-semibold">Entrar</h1>
      <UserPicker />
      <p className="mt-6 text-muted">Criar conta: em construção</p>
    </section>
  )
}
