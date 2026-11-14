const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

/** Formata centavos como moeda brasileira: 99900 → "R$ 999,00". */
export function formatCurrency(cents: number): string {
  return currency.format(cents / 100)
}

/** Formata uma data ISO em pt-BR: "14/11/2026" ou, com horário, "14/11/2026 10:30". */
export function formatDate(iso: string, withTime = false): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  const day = date.toLocaleDateString('pt-BR')
  if (!withTime) return day
  const time = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  return `${day} ${time}`
}

/** Formata milissegundos restantes como contagem regressiva: "09:59" ou "1:02:03". Zero se vencido. */
export function formatCountdown(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000))
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const seconds = total % 60
  const mm = String(minutes).padStart(2, '0')
  const ss = String(seconds).padStart(2, '0')
  return hours > 0 ? `${hours}:${mm}:${ss}` : `${mm}:${ss}`
}
