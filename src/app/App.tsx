import { Route, Routes } from 'react-router'
import { LoginPage } from '../features/account/pages/LoginPage'
import { ProfilePage } from '../features/account/pages/ProfilePage'
import { CampaignsPage } from '../features/offers/pages/CampaignsPage'
import { PollPage } from '../features/community/pages/PollPage'
import { CreateOfferPage } from '../features/offers/pages/CreateOfferPage'
import { HomePage } from '../features/offers/pages/HomePage'
import { MerchantHomePage } from '../features/offers/pages/MerchantHomePage'
import { MerchantOfferPage } from '../features/offers/pages/MerchantOfferPage'
import { OfferDetailPage } from '../features/offers/pages/OfferDetailPage'
import { VisitorHomePage } from '../features/offers/pages/VisitorHomePage'
import { MallCampaignsPage } from '../features/mall/pages/MallCampaignsPage'
import { MallFlashOffersPage } from '../features/mall/pages/MallFlashOffersPage'
import { MallHomePage } from '../features/mall/pages/MallHomePage'
import { ConfirmPurchasePage } from '../features/points/pages/ConfirmPurchasePage'
import { CouponsPage } from '../features/points/pages/CouponsPage'
import { PointsPage } from '../features/points/pages/PointsPage'
import { PurchaseCodePage } from '../features/points/pages/PurchaseCodePage'
import { ReferralPage } from '../features/referral/pages/ReferralPage'
import { Layout } from './Layout'
import { RedirectVisitorHome } from './RedirectVisitorHome'
import { RouteGuard } from './RouteGuard'

/** Rotas por perfil (SDD §9). Cada tela fica no módulo dono dela. */
export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route element={<RedirectVisitorHome />}>
          <Route path="/" element={<HomePage />} />
        </Route>
        <Route path="/profile" element={<ProfilePage />} />

        <Route element={<RouteGuard allow={['guest']} />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        <Route element={<RouteGuard allow={['visitor', 'guest']} />}>
          <Route path="/visitor/campaigns" element={<CampaignsPage />} />
          <Route path="/visitor/offers/:offerId" element={<OfferDetailPage />} />
          <Route path="/visitor/poll" element={<PollPage />} />
        </Route>

        <Route element={<RouteGuard allow={['visitor']} />}>
          <Route path="/visitor" element={<VisitorHomePage />} />
          <Route path="/visitor/coupons" element={<CouponsPage />} />
          <Route path="/visitor/purchase-code" element={<PurchaseCodePage />} />
          <Route path="/visitor/points" element={<PointsPage />} />
          <Route path="/visitor/referral" element={<ReferralPage />} />
        </Route>

        <Route element={<RouteGuard allow={['merchant']} />}>
          <Route path="/merchant" element={<MerchantHomePage />} />
          <Route path="/merchant/offers/new" element={<CreateOfferPage />} />
          <Route path="/merchant/offers/:offerId" element={<MerchantOfferPage />} />
          <Route path="/merchant/confirm-purchase" element={<ConfirmPurchasePage />} />
        </Route>

        <Route element={<RouteGuard allow={['mall']} />}>
          <Route path="/mall" element={<MallHomePage />} />
          <Route path="/mall/campaigns" element={<MallCampaignsPage />} />
          <Route path="/mall/flash-offers" element={<MallFlashOffersPage />} />
        </Route>

        <Route path="*" element={<RedirectVisitorHome fallback />} />
      </Route>
    </Routes>
  )
}
