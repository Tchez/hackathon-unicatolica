import { useReferralStore, type RegisterWithCodeError } from '../../referral/referralStore'
import { useAccountStore } from '../accountStore'

/** P8 do design: "Criar conta" sempre vira a conta da Ana, no protótipo. */
export const DEMO_NEW_USER_ID = 'user-ana'

const REGISTER_ERROR_MESSAGES: Record<RegisterWithCodeError, string> = {
  invalid_code: 'Código não encontrado. Confira o código ou siga sem ele.',
  self_referral: 'Você não pode usar o seu próprio código. Use o de outra pessoa ou siga sem código.',
  already_referred:
    'Esta conta de demonstração já foi indicada. Siga sem código ou restaure os dados de demonstração no perfil.',
  invalid_user: 'Não foi possível criar a conta. Restaure os dados de demonstração e tente de novo.',
}

export type CreateAccountResult = { ok: true } | { ok: false; message: string }

/** Entra na conta de demonstração, sem registrar indicação. */
export function enterDemoAccount(): CreateAccountResult {
  if (useAccountStore.getState().login(DEMO_NEW_USER_ID)) return { ok: true }
  return { ok: false, message: REGISTER_ERROR_MESSAGES.invalid_user }
}

/**
 * Cria a conta de demonstração. Com código, registra a indicação antes de entrar; se o código for
 * recusado, não entra e devolve a mensagem para a tela, que deixa tentar outro código ou seguir sem.
 */
export function createDemoAccount(code: string): CreateAccountResult {
  const trimmed = code.trim()
  if (trimmed) {
    const registered = useReferralStore.getState().registerWithCode(DEMO_NEW_USER_ID, trimmed)
    if (!registered.ok) return { ok: false, message: REGISTER_ERROR_MESSAGES[registered.error] }
  }
  return enterDemoAccount()
}
