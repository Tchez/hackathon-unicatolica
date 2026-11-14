import { useSyncExternalStore } from 'react'
import { FloatingNotice } from '../features/offers/components/FloatingNotice'
import { clearRouteNotice, getRouteNotice, subscribeRouteNotice } from './noticeQueue'

/** Aviso flutuante entre telas; o texto vem de `showRouteNotice`. */
export function RouteNotice() {
  const notice = useSyncExternalStore(subscribeRouteNotice, getRouteNotice, () => null)
  return <FloatingNotice notice={notice} onDone={clearRouteNotice} />
}
