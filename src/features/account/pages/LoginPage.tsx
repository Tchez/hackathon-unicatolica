import { SimulatedBadge } from '../../../components/SimulatedBadge'
import { CreateAccountForm } from '../components/CreateAccountForm'
import { SignupInvite } from '../components/SignupInvite'
import { UserPicker } from '../components/UserPicker'

/** Entrada sem login: convite, usuários de exemplo por perfil e criação de conta com código de indicação. */
export function LoginPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-6 lg:px-6 lg:py-10">
      <SignupInvite />

      <div className="flex flex-col gap-8 lg:grid lg:grid-cols-2 lg:items-start lg:gap-10">
        <section aria-labelledby="login-users-title">
          <h2 id="login-users-title" className="flex flex-wrap items-center gap-2 text-lg font-semibold">
            Entrar com um usuário de exemplo <SimulatedBadge />
          </h2>
          <p className="mb-4 mt-1 text-sm text-muted">
            Sem senha. Escolha quem você quer ser na demonstração.
          </p>
          <UserPicker />
        </section>

        <section aria-label="Criar conta">
          <CreateAccountForm />
        </section>
      </div>
    </div>
  )
}
