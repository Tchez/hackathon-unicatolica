import { useNavigate } from 'react-router'
import { ROLE_LABELS } from '../../../app/roles'
import { useAccountStore, useCurrentUser } from '../accountStore'
import { UserPicker } from '../components/UserPicker'
import { useInstallPrompt } from '../useInstallPrompt'

const buttonClass = 'min-h-12 w-full rounded-card px-4 text-base font-medium'

export function ProfilePage() {
  const user = useCurrentUser()
  const logout = useAccountStore((state) => state.logout)
  const restoreDemoData = useAccountStore((state) => state.restoreDemoData)
  const { install } = useInstallPrompt()
  const navigate = useNavigate()

  const restore = () => {
    if (
      !window.confirm(
        'Restaurar os dados de demonstração? Os dados atuais serão apagados e a sessão será encerrada.',
      )
    )
      return
    restoreDemoData()
    navigate('/')
  }

  return (
    <section className="flex flex-col gap-6 px-4 py-6">
      <div>
        <h1 className="text-xl font-semibold">Perfil</h1>
        <p className="mt-1 text-muted">
          {user ? `${user.name} · ${ROLE_LABELS[user.role]}` : 'Você não entrou'}
        </p>
      </div>

      {user && (
        <button
          type="button"
          onClick={() => {
            logout()
            navigate('/')
          }}
          className={`${buttonClass} bg-primary text-white`}
        >
          Sair
        </button>
      )}

      <div>
        <h2 className="mb-3 font-semibold">{user ? 'Trocar de usuário' : 'Entrar'}</h2>
        <UserPicker />
      </div>

      {install && (
        <button
          type="button"
          onClick={() => void install()}
          className={`${buttonClass} bg-brown-soft text-brown`}
        >
          Instalar app
        </button>
      )}

      <button type="button" onClick={restore} className={`${buttonClass} border border-line`}>
        Restaurar dados de demonstração
      </button>
    </section>
  )
}
