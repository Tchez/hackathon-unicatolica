import { AppLayout } from './AppLayout'
import { useMediaQuery } from './useMediaQuery'
import { WebLayout } from './WebLayout'

/** Escolhe o layout pela largura: web a partir de 1024 px (`lg:`), aplicativo abaixo. */
export function Layout() {
  const isWeb = useMediaQuery('(min-width: 1024px)')
  return isWeb ? <WebLayout /> : <AppLayout />
}
