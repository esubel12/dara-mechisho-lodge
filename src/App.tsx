import { Suspense, lazy } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { SiteLayout } from './components/SiteLayout'
import { I18nProvider } from './i18n/I18n'

const HomePage = lazy(() => import('./pages/Pages').then((pages) => ({ default: pages.HomePage })))
const AboutPage = lazy(() => import('./pages/Pages').then((pages) => ({ default: pages.AboutPage })))
const SpringsPage = lazy(() => import('./pages/Pages').then((pages) => ({ default: pages.SpringsPage })))
const RoomsPage = lazy(() => import('./pages/Pages').then((pages) => ({ default: pages.RoomsPage })))
const GalleryPage = lazy(() => import('./pages/Pages').then((pages) => ({ default: pages.GalleryPage })))
const DiningPage = lazy(() => import('./pages/Pages').then((pages) => ({ default: pages.DiningPage })))
const ContactPage = lazy(() => import('./pages/Pages').then((pages) => ({ default: pages.ContactPage })))
const FaqPage = lazy(() => import('./pages/Pages').then((pages) => ({ default: pages.FaqPage })))
const NotFoundPage = lazy(() => import('./pages/Pages').then((pages) => ({ default: pages.NotFoundPage })))

export default function App() {
  return (
    <I18nProvider>
      <BrowserRouter>
        <Suspense fallback={<div className="route-loading" role="status">Preparing your visit…</div>}>
          <Routes>
            <Route element={<SiteLayout />}>
              <Route index element={<HomePage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="hot-springs" element={<SpringsPage />} />
              <Route path="rooms" element={<RoomsPage />} />
              <Route path="gallery" element={<GalleryPage />} />
              <Route path="dining" element={<DiningPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="faq" element={<FaqPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </I18nProvider>
  )
}
