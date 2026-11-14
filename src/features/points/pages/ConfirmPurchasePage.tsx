import { useId, useRef, useState, type SyntheticEvent } from 'react'
import {
  CENTS_PER_POINT,
  PURCHASE_CODE_LENGTH,
  PURCHASE_CODE_VALIDITY_MINUTES,
} from '../../../config/business-rules'
import { SimulatedBadge } from '../../../components/SimulatedBadge'
import { formatCurrency } from '../../../lib/format'
import { useCurrentUser } from '../../account/accountStore'
import {
  checkPurchaseForm,
  describeConfirmation,
  formatCodeInput,
  type ConfirmOutcome,
} from '../components/merchant/confirmPurchase'
import { OutcomeMessage } from '../components/merchant/OutcomeMessage'
import { usePointsStore } from '../pointsStore'

const fieldClass =
  'h-12 w-full rounded-card bg-surface px-3.5 text-base outline-none focus-visible:ring-2 focus-visible:ring-primary'

/** Confirmar compra: o lojista digita o código do cliente e o valor; os pontos caem na conta do cliente. */
export function ConfirmPurchasePage() {
  const user = useCurrentUser()
  const confirmPurchase = usePointsStore((state) => state.confirmPurchase)

  const [code, setCode] = useState('')
  const [amount, setAmount] = useState('')
  const [outcome, setOutcome] = useState<ConfirmOutcome>()
  const codeRef = useRef<HTMLInputElement>(null)
  const amountRef = useRef<HTMLInputElement>(null)

  const codeId = useId()
  const amountId = useId()

  const submit = (event: SyntheticEvent) => {
    event.preventDefault()
    if (!user?.storeId) {
      setOutcome({
        ok: false,
        title: 'Sua conta de lojista não tem uma loja vinculada. Entre novamente pelo perfil',
      })
      return
    }
    const check = checkPurchaseForm(code, amount)
    if (!check.ok) {
      setOutcome({ ok: false, title: check.message })
      ;(check.field === 'code' ? codeRef : amountRef).current?.focus()
      return
    }
    const result = confirmPurchase(user.storeId, check.code, check.amountCents)
    setOutcome(describeConfirmation(result))
    // Compra registrada: limpa os campos para o próximo cliente. Recusa mantém o que foi digitado.
    if (result.ok) {
      setCode('')
      setAmount('')
    }
  }

  return (
    <section className="mx-auto w-full max-w-xl px-4 py-6 lg:px-6">
      <h1 className="text-2xl font-semibold">Confirmar compra</h1>
      <p className="mt-2 leading-relaxed">Digite o código que o cliente mostra e o valor da compra.</p>

      <form onSubmit={submit} noValidate className="mt-4 flex flex-col gap-4">
        <div>
          <label htmlFor={codeId} className="mb-1.5 block text-sm text-muted">
            Código do cliente ({PURCHASE_CODE_LENGTH} dígitos)
          </label>
          <input
            ref={codeRef}
            id={codeId}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            placeholder="000 000"
            value={code}
            onChange={(event) => setCode(formatCodeInput(event.target.value))}
            className={`${fieldClass} text-xl font-semibold tracking-widest tabular-nums`}
          />
        </div>

        <div>
          <label htmlFor={amountId} className="mb-1.5 flex items-center gap-2 text-sm text-muted">
            Valor da compra (R$) <SimulatedBadge />
          </label>
          <div className="flex items-center gap-2">
            <span aria-hidden className="text-base font-semibold text-muted">
              R$
            </span>
            <input
              ref={amountRef}
              id={amountId}
              type="text"
              inputMode="decimal"
              autoComplete="off"
              placeholder="150,00"
              value={amount}
              onChange={(event) => setAmount(event.target.value.replace(/[^\d.,]/g, ''))}
              className={`${fieldClass} tabular-nums`}
            />
          </div>
          <p className="mt-1.5 text-sm text-muted">
            Você digita o valor: não há ligação com o sistema de vendas da loja.
          </p>
        </div>

        <button
          type="submit"
          className="flex min-h-12 w-full items-center justify-center rounded-card bg-primary px-4 text-base font-semibold text-white"
        >
          Confirmar compra
        </button>

        <OutcomeMessage outcome={outcome} />

        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
          <span>
            1 ponto a cada {formatCurrency(CENTS_PER_POINT)} · código de uso único, válido por{' '}
            {PURCHASE_CODE_VALIDITY_MINUTES} minutos
          </span>
          <SimulatedBadge variant="illustrative" />
        </p>
      </form>
    </section>
  )
}
