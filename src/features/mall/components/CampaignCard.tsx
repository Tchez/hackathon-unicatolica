import { SimulatedBadge } from '../../../components/SimulatedBadge'
import { formatDate } from '../../../lib/format'
import { formatCount, pluralize } from '../mallFormat'
import type { CampaignKind, CampaignStatus, CampaignSummary } from '../mallCampaigns'

const KIND_LABELS: Record<CampaignKind, string> = { past: 'Passada', current: 'Atual', next: 'Próxima' }

const STATUS: Record<CampaignStatus, { label: string; tone: string }> = {
  ongoing: { label: 'Em andamento', tone: 'bg-green-soft text-green' },
  ended: { label: 'Encerrada', tone: 'bg-surface text-muted' },
  preparing: { label: 'Em preparação', tone: 'bg-gold-soft text-gold-dark' },
}

interface CampaignCardProps {
  campaign: CampaignSummary
}

/** Campanha na linha do tempo do shopping: data, número de lojas e estado. */
export function CampaignCard({ campaign }: CampaignCardProps) {
  const status = STATUS[campaign.status]
  const isCurrent = campaign.kind === 'current'
  return (
    <li
      className={`flex flex-col gap-3 rounded-card border p-4 ${isCurrent ? 'border-primary bg-primary-soft' : 'border-line'}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            {KIND_LABELS[campaign.kind]}
          </p>
          <h2 className="font-semibold">{campaign.name}</h2>
        </div>
        <span
          className={`inline-flex shrink-0 items-center rounded-card px-2 py-0.5 text-xs font-semibold ${status.tone}`}
        >
          {status.label}
        </span>
      </div>

      <p className="text-sm text-muted">
        {formatDate(campaign.date)} · {formatCount(campaign.storeCount)}{' '}
        {pluralize(campaign.storeCount, 'loja', 'lojas')}
      </p>

      <p className="text-sm">{campaign.description}</p>

      {campaign.result && (
        <p className="text-sm font-medium">
          Resultado: {formatCount(campaign.result.couponsRedeemed)} cupons resgatados e{' '}
          {formatCount(campaign.result.purchases)} compras comprovadas.
        </p>
      )}

      {campaign.simulated && (
        <p>
          <SimulatedBadge />
        </p>
      )}
    </li>
  )
}
