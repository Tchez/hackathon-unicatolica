import { useNavigate } from 'react-router'
import { ROLE_LABELS } from '../../../app/roles'
import type { Role } from '../../../types'
import { useAccountStore } from '../accountStore'
import { useReturnPath } from './useReturnPath'

const ROLE_ORDER: Role[] = ['visitor', 'merchant', 'mall']

/** Usuários de exemplo agrupados por perfil, sem senha: escolher um entra no perfil e volta à tela de origem, se houver. */
export function UserPicker() {
  const users = useAccountStore((state) => state.users)
  const login = useAccountStore((state) => state.login)
  const navigate = useNavigate()
  const returnPath = useReturnPath()

  return (
    <div className="flex flex-col gap-5">
      {ROLE_ORDER.map((role) => {
        const group = users.filter((user) => user.role === role)
        if (group.length === 0) return null
        return (
          <div key={role}>
            <h3 className="mb-2 text-sm font-semibold text-muted">{ROLE_LABELS[role]}</h3>
            <ul className="flex flex-col gap-2">
              {group.map((user) => (
                <li key={user.id}>
                  <button
                    type="button"
                    onClick={() => {
                      if (login(user.id)) navigate(returnPath(user.role), { replace: true })
                    }}
                    className="flex min-h-12 w-full items-center rounded-card bg-surface px-4 py-2 text-left font-medium hover:bg-primary-soft"
                  >
                    {user.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </div>
  )
}
