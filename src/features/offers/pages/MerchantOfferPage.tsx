import { Clock } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation, useParams } from 'react-router'
import { formatCountdown, formatDate } from '../../../lib/format'
import { getOfferStatus, getRemaining } from '../../../lib/offers'
import { useCurrentUser } from '../../account/accountStore'
import { InlineMessage, type MessageTone } from '../components/merchant/InlineMessage'
import { OfferStateChip } from '../components/merchant/OfferStateChip'
import {
  outlineButtonClass,
  primaryButtonClass,
  secondaryButtonClass,
} from '../components/merchant/formStyles'
import { redeemedLabel } from '../components/merchant/labels'
import { useNow } from '../components/merchant/useNow'
import { useOffersStore } from '../offersStore'

interface Notice {
  tone: MessageTone
  text: string
}

/** A criação de oferta navega para cá com `state.published`, para confirmar a publicação. */
function wasJustPublished(state: unknown): boolean {
  return typeof state === 'object' && state !== null && 'published' in state && state.published === true
}

/** Acompanhar oferta: contagem, restantes e resgates ao vivo; encerrar antes do prazo. */
export function MerchantOfferPage() {
  const { offerId } = useParams()
  const user = useCurrentUser()
  const location = useLocation()
  const stores = useOffersStore((state) => state.stores)
  const campaigns = useOffersStore((state) => state.campaigns)
  const offers = useOffersStore((state) => state.offers)
  const closeOffer = useOffersStore((state) => state.closeOffer)
  const now = useNow()

  const [confirming, setConfirming] = useState(false)
  const [notice, setNotice] = useState<Notice | undefined>(() =>
    wasJustPublished(location.state)
      ? { tone: 'success', text: 'Oferta publicada. Os visitantes já podem resgatar.' }
      : undefined,
  )

  // O lojista só acompanha as ofertas da própria loja.
  const offer = offers.find((item) => item.id === offerId && item.storeId === user?.storeId)
  if (!offer) {
    return (
      <section className="mx-auto w-full max-w-xl px-4 py-6 lg:px-6">
        <h1 className="text-2xl font-semibold">Oferta não encontrada</h1>
        <p className="mt-2 text-muted">Essa oferta não existe ou não é da sua loja.</p>
        <Link to="/merchant" className={`${primaryButtonClass} mt-5`}>
          Voltar ao início
        </Link>
      </section>
    )
  }

  const status = getOfferStatus(offer, now)
  const remaining = getRemaining(offer, now)
  const released = offer.redeemedCount + remaining
  const redeemedPercent = released > 0 ? Math.round((offer.redeemedCount / released) * 100) : 0
  const storeName = stores.find((item) => item.id === offer.storeId)?.name
  const campaignName = campaigns.find((item) => item.id === offer.campaignId)?.name
  const canClose = status === 'live' || status === 'upcoming'

  const close = () => {
    const result = closeOffer(offer.id)
    setConfirming(false)
    setNotice(
      result.ok
        ? { tone: 'success', text: 'Oferta encerrada.' }
        : { tone: 'error', text: 'Oferta não encontrada. Volte ao início e tente de novo.' },
    )
  }

  return (
    <section className="mx-auto w-full max-w-xl px-4 py-6 lg:px-6">
      <p className="text-sm text-muted">Acompanhar oferta</p>
      <h1 className="text-2xl font-semibold break-words">
        {offer.title} · {offer.discountPercent}% OFF
      </h1>
      <p className="mt-1 text-sm text-muted">
        {storeName} · {campaignName ?? 'Oferta relâmpago'}
      </p>
      <div className="mt-2">
        <OfferStateChip status={status} />
      </div>

      {notice && (
        <div className="mt-4">
          <InlineMessage tone={notice.tone}>{notice.text}</InlineMessage>
        </div>
      )}

      <dl className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-card bg-surface p-3.5">
          <dt className="text-sm text-muted">Resgates</dt>
          <dd className="text-3xl font-bold text-primary tabular-nums">{offer.redeemedCount}</dd>
        </div>
        <div className="rounded-card bg-surface p-3.5">
          <dt className="text-sm text-muted">Restantes</dt>
          {status === 'upcoming' ? (
            <dd className="pt-2 text-base font-semibold text-muted">Aguardando o lote</dd>
          ) : (
            <dd className="text-3xl font-bold text-primary tabular-nums">{remaining}</dd>
          )}
        </div>
      </dl>

      <div className="mt-4">
        <div
          role="progressbar"
          aria-label="Unidades resgatadas"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={redeemedPercent}
          className="h-2 overflow-hidden rounded-full bg-line"
        >
          <div className="h-full rounded-full bg-primary" style={{ width: `${redeemedPercent}%` }} />
        </div>
        <p className="mt-1.5 text-sm text-muted">
          {released > 0
            ? `${redeemedLabel(offer.redeemedCount)} de ${released} unidades liberadas`
            : 'Nenhuma unidade liberada ainda'}
        </p>
      </div>

      <div className="mt-4 flex items-center gap-3 border-y border-line py-3.5">
        <Clock aria-hidden className="size-5 flex-none text-primary" />
        {status === 'live' && (
          <>
            <span className="font-semibold">Termina em</span>
            <span className="ml-auto text-lg font-semibold text-primary tabular-nums">
              {formatCountdown(new Date(offer.endsAt).getTime() - now)}
            </span>
          </>
        )}
        {status === 'upcoming' && <span className="font-semibold">Aguardando a liberação do lote</span>}
        {status === 'sold_out' && (
          <span className="font-semibold">Esgotada: todas as unidades foram resgatadas</span>
        )}
        {status === 'ended' && (
          <>
            <span className="font-semibold">Encerrada em</span>
            <span className="ml-auto text-sm text-muted tabular-nums">{formatDate(offer.endsAt, true)}</span>
          </>
        )}
      </div>

      {offer.campaignId && status === 'upcoming' && (
        <div className="mt-4">
          <InlineMessage tone="info">
            Este lote é liberado pela administração do shopping, em horário surpresa.
          </InlineMessage>
        </div>
      )}

      <p className="mt-4 text-sm text-muted">A oferta encerra sozinha ao expirar ou esgotar.</p>

      <div className="mt-4 flex flex-col gap-3">
        {confirming && canClose ? (
          <div role="group" aria-label="Confirmar encerramento" className="flex flex-col gap-3">
            <InlineMessage tone="info">
              Encerrar esta oferta agora? Os visitantes não poderão mais resgatar e ela não pode ser reaberta.
            </InlineMessage>
            <button type="button" onClick={close} className={primaryButtonClass}>
              Sim, encerrar agora
            </button>
            <button type="button" onClick={() => setConfirming(false)} className={secondaryButtonClass}>
              Cancelar
            </button>
          </div>
        ) : (
          <button
            type="button"
            disabled={!canClose}
            onClick={() => setConfirming(true)}
            className={outlineButtonClass}
          >
            Encerrar agora
          </button>
        )}
        <Link to="/merchant/confirm-purchase" className={secondaryButtonClass}>
          Confirmar compra
        </Link>
      </div>
    </section>
  )
}
