export const TAPS_TO_TRIGGER = 5
export const MAX_TAP_GAP_MS = 1500

const FRIDAY = 5

function isFriday13Date(date: Date): boolean {
  return date.getDate() === 13 && date.getDay() === FRIDAY
}

/** Hoje é sexta-feira 13 (data local)? */
export function isFriday13(now: number | Date): boolean {
  return isFriday13Date(new Date(now))
}

/** Dia 13 de um mês (local, à meia-noite), com `offset` meses a partir do mês de `now`. */
function day13(now: Date, offset: number): Date {
  return new Date(now.getFullYear(), now.getMonth() + offset, 13)
}

function startOfDay(now: Date): Date {
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

/** Última sexta-feira 13 antes de hoje (hoje não conta). */
export function lastFriday13(now: number | Date): Date {
  const today = startOfDay(new Date(now))
  for (let offset = 0; ; offset--) {
    const candidate = day13(today, offset)
    if (candidate < today && isFriday13Date(candidate)) return candidate
  }
}

/** Próxima sexta-feira 13 depois de hoje (hoje não conta). */
export function nextFriday13(now: number | Date): Date {
  const today = startOfDay(new Date(now))
  for (let offset = 0; ; offset++) {
    const candidate = day13(today, offset)
    if (candidate > today && isFriday13Date(candidate)) return candidate
  }
}

/**
 * Contador de toques: guarda os toques recentes (cada um a no máximo 1,5 s do anterior) e dispara no
 * quinto. Depois de disparar, o histórico volta a zero.
 */
export function registerTap(history: number[], now: number): { history: number[]; triggered: boolean } {
  const last = history.at(-1)
  const streak = last !== undefined && now - last <= MAX_TAP_GAP_MS ? [...history, now] : [now]
  if (streak.length >= TAPS_TO_TRIGGER) return { history: [], triggered: true }
  return { history: streak, triggered: false }
}
