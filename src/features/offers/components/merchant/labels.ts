/** "1 resgate" ou "5 resgates". */
export function redeemedLabel(count: number): string {
  return `${count} ${count === 1 ? 'resgate' : 'resgates'}`
}

/** "1 restante" ou "5 restantes". */
export function remainingLabel(count: number): string {
  return `${count} ${count === 1 ? 'restante' : 'restantes'}`
}
