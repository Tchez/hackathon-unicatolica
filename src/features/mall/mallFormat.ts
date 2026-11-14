const count = new Intl.NumberFormat('pt-BR')

/** Formata uma contagem em pt-BR: 1200 → "1.200". */
export function formatCount(value: number): string {
  return count.format(value)
}

/** Escolhe singular ou plural pela quantidade: (1, 'unidade', 'unidades') → "unidade". */
export function pluralize(value: number, singular: string, plural: string): string {
  return value === 1 ? singular : plural
}

/** Antes de liberar: quantos visitantes receberão o aviso (simulação, Q09). */
export function describeNoticeForecast(presentCount: number): string {
  if (presentCount === 0) return 'Nenhum visitante marcou "Estou no shopping"; ninguém recebe o aviso agora.'
  const who = pluralize(presentCount, 'visitante marcou', 'visitantes marcaram')
  const verb = pluralize(presentCount, 'recebe', 'recebem')
  return `${formatCount(presentCount)} ${who} "Estou no shopping" e ${verb} o aviso.`
}

/** Depois de liberar: quantos visitantes presentes foram avisados. */
export function describeNoticeSent(presentCount: number): string {
  if (presentCount === 0) return 'Ninguém marcou "Estou no shopping" para receber o aviso.'
  const who = pluralize(presentCount, 'visitante presente foi avisado', 'visitantes presentes foram avisados')
  return `${formatCount(presentCount)} ${who}.`
}
