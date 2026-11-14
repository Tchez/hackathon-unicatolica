import { useNavigate } from 'react-router'
import { HOME_BY_ROLE, ROLE_LABELS } from '../../../app/roles'
import { SimulatedBadge } from '../../../components/SimulatedBadge'
import { useAccountStore } from '../accountStore'

/** Lista de usuários de exemplo, sem senha: escolher um entra no perfil dele. */
export function UserPicker() {
  const users = useAccountStore((state) => state.users)
  const login = useAccountStore((state) => state.login)
  const navigate = useNavigate()

  return (
    <div>
      <p className="mb-3 flex items-center gap-2 text-sm text-muted">
        Escolha um usuário de exemplo, sem senha <SimulatedBadge />
      </p>
      <ul className="flex flex-col gap-2">
        {users.map((user) => (
          <li key={user.id}>
            <button
              type="button"
              onClick={() => {
                if (login(user.id)) navigate(HOME_BY_ROLE[user.role])
              }}
              className="flex min-h-12 w-full flex-col items-start rounded-card bg-surface px-4 py-2 text-left"
            >
              <span className="font-medium">{user.name}</span>
              <span className="text-xs text-muted">{ROLE_LABELS[user.role]}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
