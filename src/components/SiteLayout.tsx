import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { ArrowUpRight, MapPin, Menu, MessageCircle, Phone, Waves, X } from 'lucide-react'
import { getTelegramUrl, getWhatsAppUrl, lodge } from '../data/lodge'
import { useI18n, type Language } from '../i18n/context'

const currentYear = new Date().getFullYear()

const navigation = [
  { to: '/', key: 'home' as const, end: true },
  { to: '/about', key: 'about' as const },
  { to: '/hot-springs', key: 'springs' as const },
  { to: '/rooms', key: 'rooms' as const },
  { to: '/gallery', key: 'gallery' as const },
  { to: '/dining', key: 'dining' as const },
  { to: '/faq', key: 'faq' as const },
]

export function SiteLayout() {
  const { pathname } = useLocation()
  const { language, setLanguage, t } = useI18n()
  const [menuState, setMenuState] = useState({ path: pathname, open: false })
  const menuOpen = menuState.path === pathname && menuState.open
  const [scrolled, setScrolled] = useState(false)
  const whatsappUrl = getWhatsAppUrl()
  const quickWhatsAppUrl = getWhatsAppUrl(`${t('whatsappInquiryIntro')} ${lodge.name}.`)
  const telegramUrl = getTelegramUrl()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  useEffect(() => {
    const updateScroll = () => setScrolled(window.scrollY > 24)
    updateScroll()
    window.addEventListener('scroll', updateScroll, { passive: true })
    return () => window.removeEventListener('scroll', updateScroll)
  }, [])

  const toggleLanguage = () => setLanguage(language === 'en' ? 'am' : 'en')

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="nav-shell">
          <Link className="brand" to="/" aria-label={`${lodge.name} home`}>
            <span className="brand-mark"><Waves size={23} strokeWidth={1.7} /></span>
            <span className="brand-copy">
              <span>{lodge.name}</span>
              <small>HOT SPRING LODGE</small>
            </span>
          </Link>
          <nav className={`main-nav ${menuOpen ? 'menu-open' : ''}`} id="main-menu" aria-label="Main navigation">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={'end' in item ? item.end : undefined}
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              >
                {t(item.key)}
              </NavLink>
            ))}
            <NavLink to="/contact" className="nav-contact">{t('contact')} <ArrowUpRight size={14} /></NavLink>
            <button className="language-toggle" onClick={toggleLanguage} aria-label={`Switch language to ${t('langLabel')}`}>
              {language === 'en' ? 'አማ' : 'EN'}
            </button>
            <Link className="button button-small nav-book" to="/contact#inquiry">{t('inquire')} <ArrowUpRight size={15} /></Link>
          </nav>
          <button
            className="menu-toggle"
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="main-menu"
            onClick={() => setMenuState({ path: pathname, open: !menuOpen })}
          >
            {menuOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
      </header>
      <main id="main-content"><Outlet /></main>
      <footer className="site-footer">
        <div className="footer-main">
          <div className="footer-brand">
            <Link className="brand brand-light" to="/">
              <span className="brand-mark"><Waves size={22} /></span>
              <span className="brand-copy"><span>{lodge.name}</span><small>HOT SPRING LODGE</small></span>
            </Link>
            <p>{t('footerText')}</p>
            <span className="footer-location"><MapPin size={15} /> {lodge.area}</span>
          </div>
          <div className="footer-column">
            <h2>Explore</h2>
            <Link to="/about">{t('about')}</Link>
            <Link to="/hot-springs">{t('springs')}</Link>
            <Link to="/rooms">{t('rooms')}</Link>
            <Link to="/gallery">{t('gallery')}</Link>
          </div>
          <div className="footer-column">
            <h2>Plan your visit</h2>
            <Link to="/dining">{t('dining')}</Link>
            <Link to="/faq">{t('faq')}</Link>
            <Link to="/contact">{t('contact')}</Link>
            <span>{lodge.openingHours || t('hoursNotConfirmed')}</span>
          </div>
          <div className="footer-contact">
            <h2>We’d love to hear from you</h2>
            <a href={`tel:${lodge.phoneLink}`}><Phone size={16} /> {lodge.phone}</a>
            {whatsappUrl && <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">WhatsApp <ArrowUpRight size={15} /></a>}
            {telegramUrl && <a href={telegramUrl} target="_blank" rel="noopener noreferrer">Telegram <ArrowUpRight size={15} /></a>}
            {lodge.email && <a href={`mailto:${lodge.email}`}>{lodge.email}</a>}
            {lodge.socialLinks.map((social) => <a href={social.url} key={social.url} target="_blank" rel="noopener noreferrer">{social.label} <ArrowUpRight size={15} /></a>)}
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {currentYear} {lodge.name}</span>
          <span>Made for slower days in Sidama, Ethiopia</span>
        </div>
      </footer>
      <div className="mobile-contact" aria-label="Quick contact">
        <a href={`tel:${lodge.phoneLink}`}><Phone size={17} /> {t('call')}</a>
        {quickWhatsAppUrl ? (
          <a href={quickWhatsAppUrl} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={17} /> WhatsApp
          </a>
        ) : (
          <span className="mobile-contact-unavailable" aria-label={`WhatsApp: ${t('contactNotConfigured')}`} title={t('contactNotConfigured')}>
            <MessageCircle size={17} /> WhatsApp
          </span>
        )}
      </div>
    </>
  )
}

export function LanguageButton({ className = '' }: { className?: string }) {
  const { language, setLanguage } = useI18n()
  const nextLanguage: Language = language === 'en' ? 'am' : 'en'
  return (
    <button className={className} type="button" onClick={() => setLanguage(nextLanguage)}>
      {nextLanguage === 'am' ? 'አማ' : 'EN'}
    </button>
  )
}
