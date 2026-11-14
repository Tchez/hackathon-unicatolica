import { useId, useRef, useState, type SyntheticEvent } from 'react'
import { useNavigate } from 'react-router'
import { useCurrentUser } from '../../account/accountStore'
import { InlineMessage } from '../components/merchant/InlineMessage'
import { OfferPreviewCard } from '../components/merchant/OfferPreviewCard'
import { QuantityStepper } from '../components/merchant/QuantityStepper'
import {
  createErrorMessage,
  DEFAULT_DISCOUNT_PERCENT,
  DEFAULT_DURATION_MINUTES,
  DEFAULT_QUANTITY,
  durationLabel,
  FLASH_OFFER_DISCOUNTS,
  FLASH_OFFER_TITLE_MAX_LENGTH,
  validateTitle,
} from '../components/merchant/flashOffer'
import { fieldClass, labelClass, primaryButtonClass } from '../components/merchant/formStyles'
import { FLASH_OFFER_DURATIONS_MINUTES } from '../../../config/business-rules'
import { useOffersStore } from '../offersStore'

/** Criar oferta relâmpago: produto, desconto, duração e quantidade, com a prévia do card do visitante. */
export function CreateOfferPage() {
  const user = useCurrentUser()
  const navigate = useNavigate()
  const stores = useOffersStore((state) => state.stores)
  const createFlashOffer = useOffersStore((state) => state.createFlashOffer)

  const [title, setTitle] = useState('')
  const [discountPercent, setDiscountPercent] = useState(DEFAULT_DISCOUNT_PERCENT)
  const [durationMinutes, setDurationMinutes] = useState(DEFAULT_DURATION_MINUTES)
  const [quantity, setQuantity] = useState(DEFAULT_QUANTITY)
  const [error, setError] = useState<string>()
  const titleRef = useRef<HTMLInputElement>(null)

  const titleId = useId()
  const discountId = useId()
  const durationId = useId()
  const quantityId = useId()

  const store = stores.find((item) => item.id === user?.storeId)

  const publish = (event: SyntheticEvent) => {
    event.preventDefault()
    if (!user?.storeId || !store) {
      setError('Sua conta de lojista não tem uma loja vinculada. Entre novamente.')
      return
    }
    const titleError = validateTitle(title)
    if (titleError) {
      setError(titleError)
      titleRef.current?.focus()
      return
    }
    const result = createFlashOffer({
      storeId: user.storeId,
      title,
      discountPercent,
      durationMinutes,
      quantity,
    })
    if (!result.ok) {
      setError(createErrorMessage(result.error))
      return
    }
    navigate(`/merchant/offers/${result.value.id}`, { replace: true, state: { published: true } })
  }

  return (
    <section className="mx-auto w-full max-w-xl px-4 py-6 lg:px-6">
      <p className="text-sm text-muted">{store?.name ?? 'Loja'}</p>
      <h1 className="text-2xl font-semibold">Criar oferta relâmpago</h1>

      <form onSubmit={publish} noValidate className="mt-5 flex flex-col gap-4">
        <div>
          <label htmlFor={titleId} className={labelClass}>
            Produto
          </label>
          <input
            ref={titleRef}
            id={titleId}
            type="text"
            maxLength={FLASH_OFFER_TITLE_MAX_LENGTH}
            autoComplete="off"
            placeholder="Ex.: Fone Bluetooth"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value)
              setError(undefined)
            }}
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor={discountId} className={labelClass}>
            Desconto
          </label>
          <select
            id={discountId}
            value={discountPercent}
            onChange={(event) => setDiscountPercent(Number(event.target.value))}
            className={fieldClass}
          >
            {FLASH_OFFER_DISCOUNTS.map((percent) => (
              <option key={percent} value={percent}>
                {percent}%
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={durationId} className={labelClass}>
              Duração
            </label>
            <select
              id={durationId}
              value={durationMinutes}
              onChange={(event) => setDurationMinutes(Number(event.target.value))}
              className={fieldClass}
            >
              {FLASH_OFFER_DURATIONS_MINUTES.map((minutes) => (
                <option key={minutes} value={minutes}>
                  {durationLabel(minutes)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor={quantityId} className={labelClass}>
              Quantidade
            </label>
            <QuantityStepper id={quantityId} value={quantity} onChange={setQuantity} />
          </div>
        </div>

        <div className="mt-2">
          <h2 className="mb-1 text-lg font-semibold">Prévia</h2>
          <p className="mb-2 text-sm text-muted">Assim o visitante verá a oferta.</p>
          <OfferPreviewCard
            title={title}
            storeName={store?.name ?? 'Loja'}
            discountPercent={discountPercent}
            durationMinutes={durationMinutes}
            quantity={quantity}
          />
        </div>

        {error && <InlineMessage tone="error">{error}</InlineMessage>}

        <div>
          <button type="submit" className={primaryButtonClass}>
            Publicar oferta
          </button>
          <p className="mt-2 text-center text-sm text-muted">Leva menos de 1 minuto</p>
        </div>
      </form>
    </section>
  )
}
