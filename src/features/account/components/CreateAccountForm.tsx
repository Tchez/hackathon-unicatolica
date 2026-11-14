import { useId, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { showRouteNotice } from '../../../app/RouteNotice'
import { SimulatedBadge } from '../../../components/SimulatedBadge'
import { getUser } from '../accountStore'
import {
  createDemoAccount,
  DEMO_NEW_USER_ID,
  enterDemoAccount,
  type CreateAccountResult,
} from './createAccount'
import { useReturnPath } from './useReturnPath'

export const CODE_INPUT_ID = 'create-account-code'

/** Bloco "Criar conta": só o código de indicação, opcional (coleta mínima, RNF05). */
export function CreateAccountForm() {
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const returnPath = useReturnPath()
  const inputId = CODE_INPUT_ID
  const hintId = useId()
  const errorId = useId()

  const finish = (result: CreateAccountResult) => {
    if (result.ok) {
      // A conta criada é sempre a da Ana, uma visitante (P8 do design).
      const name = getUser(DEMO_NEW_USER_ID)?.name.split(' ')[0]
      showRouteNotice(name ? `Conta criada. Olá, ${name}!` : 'Conta criada.')
      navigate(returnPath('visitor'), { replace: true })
      return
    }
    setError(result.message)
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    finish(createDemoAccount(code))
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4">
      <div>
        <h2 className="flex flex-wrap items-center gap-2 text-lg font-semibold">
          Criar conta <SimulatedBadge />
        </h2>
        <p className="mt-1 text-sm text-muted">
          Cadastro simulado: a conta criada é a da Ana, com dados fictícios.
        </p>
      </div>

      <div>
        <label htmlFor={inputId} className="mb-1 block text-sm font-medium">
          Código de indicação (opcional)
        </label>
        <input
          id={inputId}
          type="text"
          value={code}
          onChange={(event) => {
            setCode(event.target.value)
            setError(null)
          }}
          placeholder="Ex.: BRUNO100"
          autoCapitalize="characters"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${hintId} ${errorId}` : hintId}
          className="min-h-12 w-full rounded-card bg-surface px-4 uppercase placeholder:normal-case"
        />
        <p id={hintId} className="mt-1 text-xs text-muted">
          Na demonstração, o código do Bruno é BRUNO100.
        </p>
      </div>

      {error && (
        <p
          id={errorId}
          role="alert"
          className="rounded-card bg-primary-soft px-4 py-3 text-sm font-medium text-primary-dark"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        className="min-h-12 w-full rounded-card bg-primary px-4 text-base font-medium text-white"
      >
        Criar conta
      </button>

      {error && (
        <button
          type="button"
          onClick={() => finish(enterDemoAccount())}
          className="min-h-12 w-full rounded-card border border-line px-4 text-base font-medium"
        >
          Criar conta sem código
        </button>
      )}
    </form>
  )
}
