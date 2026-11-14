import { Link, useNavigate } from 'react-router'
import { ROLE_LABELS } from '../../../app/roles'
import { useAccountStore, useCurrentUser } from '../accountStore'
import { MarketingConsent } from '../components/MarketingConsent'
import { useInstallPrompt } from '../useInstallPrompt'

const buttonClass = 'flex min-h-12 w-full items-center justify-center rounded-card px-4 text-base font-medium'

/** Perfil: visitante vê consentimento e instalação; lojista e shopping veem só nome, restaurar e sair. */
export function ProfilePage() {
  const user = useCurrentUser()
  const logout = useAccountStore((state) => state.logout)
  const restoreDemoData = useAccountStore((state) => state.restoreDemoData)
  const { install } = useInstallPrompt()
  const navigate = useNavigate()

  const isVisitor = user?.role === 'visitor'
  // Lojista e shopping não instalam o app por aqui; sem login, a instalação continua disponível.
  const installApp = !user || isVisitor ? install : null

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
    <section className="mx-auto flex w-full max-w-xl flex-col gap-6 px-4 py-6 lg:py-10">
      <h1 className="text-xl font-semibold">Perfil</h1>

      <div className="flex items-center gap-4 rounded-card bg-surface p-4">
        <span
          aria-hidden
          className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xl font-semibold text-primary"
        >
          {user ? user.name.charAt(0).toUpperCase() : '?'}
        </span>
        <div>
          <p className="font-semibold">{user ? user.name : 'Você não entrou'}</p>
          <p className="text-sm text-muted">{user ? ROLE_LABELS[user.role] : 'Navegando sem conta'}</p>
        </div>
      </div>

      {!user && (
        <Link to="/login" className={`${buttonClass} bg-primary text-white`}>
          Entrar ou criar conta
        </Link>
      )}

      {user && isVisitor && (
        <section aria-labelledby="profile-consent-title">
          <h2 id="profile-consent-title" className="mb-3 font-semibold">
            Consentimento
          </h2>
          <MarketingConsent userId={user.id} />
        </section>
      )}

      {installApp && (
        <button
          type="button"
          onClick={() => void installApp()}
          className={`${buttonClass} bg-brown-soft text-brown`}
        >
          Instalar app
        </button>
      )}

      <div className="flex flex-col gap-3">
        <button type="button" onClick={restore} className={`${buttonClass} border border-line`}>
          Restaurar dados de demonstração
        </button>
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
      </div>
    </section>
  )
}
