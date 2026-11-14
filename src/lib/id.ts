/** Gera um id único em texto, com prefixo legível. */
export function createId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`
}
