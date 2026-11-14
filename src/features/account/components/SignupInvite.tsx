import { UserPlus } from 'lucide-react'

/** Convite para quem tentou uma ação que exige conta (J1). Título da tela de entrada. */
export function SignupInvite() {
  return (
    <div className="flex items-start gap-4 rounded-card bg-primary-soft p-4">
      <span className="flex size-12 shrink-0 items-center justify-center rounded-card bg-background text-primary">
        <UserPlus aria-hidden className="size-6" />
      </span>
      <div>
        <h1 className="text-lg font-semibold text-primary-dark">
          Crie sua conta para resgatar cupons e juntar pontos
        </h1>
        <p className="mt-1 text-sm text-muted">
          Pedimos só o essencial. Você continua vendo campanhas e ofertas sem conta.
        </p>
      </div>
    </div>
  )
}
