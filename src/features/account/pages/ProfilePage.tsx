import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { ROLE_LABELS } from '../../../app/roles'
import { useAccountStore, useCurrentUser } from '../accountStore'
import { Friday13Overlay } from '../components/Friday13Overlay'
import { registerTap } from '../components/friday13'
import { MarketingConsent } from '../components/MarketingConsent'
import { useInstallPrompt } from '../useInstallPrompt'

const buttonClass = 'flex min-h-12 w-full items-center justify-center rounded-card px-4 text-base font-medium'

/** Perfil: visitante vê consentimento e instalação; lojista e shopping veem só nome, restaurar e sair. */
export function ProfilePage() {
  const user = useCurrentUser()
  const logout = useAccountStore((state) => state.logout)
  const restoreDemoData = useAccountStore((state) => state.restoreDemoData)
  const { install, showIosHint } = useInstallPrompt()
  const navigate = useNavigate()
  const [showFriday13, setShowFriday13] = useState(false)
  const taps = useRef<number[]>([])

  // Easter Egg: 5 toques rápidos no avatar abrem a tela de sexta-feira 13 (SPEC 007).
  const tapAvatar = () => {
    const result = registerTap(taps.current, Date.now())
    taps.current = result.history
    if (result.triggered) setShowFriday13(true)
  }

  const isVisitor = user?.role === 'visitor'
  // Lojista e shopping não instalam o app por aqui; sem login, a instalação continua disponível.
  const canInstall = !user || isVisitor
  const installApp = canInstall ? install : null

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
        <button
          type="button"
          aria-label="Avatar"
          onClick={tapAvatar}
          className="flex size-12 shrink-0 items-center justify-center cursor-default rounded-full bg-primary-soft text-xl font-semibold text-primary"
        >
          {user ? user.name.charAt(0).toUpperCase() : '?'}
        </button>
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

      {canInstall && !installApp && showIosHint && (
        <section aria-labelledby="profile-ios-install-title" className="rounded-card bg-surface p-4">
          <h2 id="profile-ios-install-title" className="font-semibold">
            Instalar app (opcional)
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            No Safari, toque em Compartilhar e depois em Adicionar à Tela de Início. O app funciona igual sem
            instalar.
          </p>
        </section>
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
              navigate('/login')
            }}
            className={`${buttonClass} bg-primary text-white`}
          >
            Sair
          </button>
        )}
      </div>
      {showFriday13 && <Friday13Overlay onClose={() => setShowFriday13(false)} />}
    </section>
  )
}
