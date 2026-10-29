import { useState } from 'react'
import {
  ArrowUpRight,
  Check,
  Clock3,
  Copy,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from 'lucide-react'
import { ContactInquiryForm } from './ContactInquiryForm'
import { getTelegramUrl, getWhatsAppUrl, lodge } from '../data/lodge'
import { useI18n } from '../i18n/context'

export function ContactLocation() {
  const { t } = useI18n()
  const [copyState, setCopyState] = useState<'copied' | 'error' | ''>('')
  const whatsappUrl = getWhatsAppUrl()
  const telegramUrl = getTelegramUrl()
  const placeAddress = lodge.fullAddress || lodge.area
  const businessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: lodge.name,
    telephone: lodge.phoneLink,
    ...(lodge.email ? { email: lodge.email } : {}),
    address: {
      '@type': 'PostalAddress',
      ...(lodge.fullAddress ? { streetAddress: lodge.fullAddress } : {}),
      addressLocality: lodge.addressLocality,
      addressRegion: lodge.addressRegion,
      addressCountry: lodge.addressCountry,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: lodge.latitude,
      longitude: lodge.longitude,
    },
    hasMap: lodge.googleMapsLink,
    ...(lodge.socialLinks.length > 0 ? { sameAs: lodge.socialLinks.map((social) => social.url) } : {}),
  }
  const schemaScript = JSON.stringify(businessSchema).replace(/</g, '\\u003c')

  const copyPlusCode = async () => {
    try {
      await navigator.clipboard.writeText(lodge.plusCode)
      setCopyState('copied')
      window.setTimeout(() => setCopyState(''), 1800)
    } catch (error) {
      console.error('Unable to copy the lodge Plus Code:', error)
      setCopyState('error')
    }
  }

  const routeValue = (value: string) => value || t('routeToConfirm')

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaScript }} />
      <section className="contact-page-layout content-width" aria-label={t('contactFormTitle')}>
        <div className="contact-form-panel" id="inquiry">
          <div className="contact-form-heading">
            <h2>{t('contactFormTitle')}</h2>
            <p>{t('contactFormText')}</p>
          </div>
          <ContactInquiryForm />
        </div>

        <aside className="contact-location-column">
          <div className="contact-intro-copy">
            <span className="eyebrow">{t('contact')}</span>
            <h2>{t('contactIntroTitle')}</h2>
            <p>{t('contactIntroText')}</p>
          </div>

          <div className="contact-method-grid">
            <a className="contact-method" href={`tel:${lodge.phoneLink}`}>
              <span className="contact-method-icon"><Phone size={19} /></span>
              <span className="contact-method-copy">
                <strong>{t('phoneCardTitle')}</strong>
                <span>{lodge.phone}</span>
              </span>
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
            {whatsappUrl ? (
              <a className="contact-method" href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <span className="contact-method-icon"><MessageCircle size={19} /></span>
                <span className="contact-method-copy"><strong>{t('whatsappCardTitle')}</strong><span>{lodge.whatsappNumber}</span></span>
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            ) : (
              <div className="contact-method contact-method-unavailable" aria-disabled="true">
                <span className="contact-method-icon"><MessageCircle size={19} /></span>
                <span className="contact-method-copy"><strong>{t('whatsappCardTitle')}</strong><span>{t('contactNotConfigured')}</span></span>
              </div>
            )}
            {telegramUrl ? (
              <a className="contact-method" href={telegramUrl} target="_blank" rel="noopener noreferrer">
                <span className="contact-method-icon"><Send size={18} /></span>
                <span className="contact-method-copy"><strong>{t('telegramCardTitle')}</strong><span>@{lodge.telegramHandle.replace(/^@/, '')}</span></span>
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            ) : (
              <div className="contact-method contact-method-unavailable" aria-disabled="true">
                <span className="contact-method-icon"><Send size={18} /></span>
                <span className="contact-method-copy"><strong>{t('telegramCardTitle')}</strong><span>{t('contactNotConfigured')}</span></span>
              </div>
            )}
            {lodge.email ? (
              <a className="contact-method" href={`mailto:${lodge.email}`}>
                <span className="contact-method-icon"><Mail size={19} /></span>
                <span className="contact-method-copy"><strong>{t('emailCardTitle')}</strong><span>{lodge.email}</span></span>
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            ) : (
              <div className="contact-method contact-method-unavailable" aria-disabled="true">
                <span className="contact-method-icon"><Mail size={19} /></span>
                <span className="contact-method-copy"><strong>{t('emailCardTitle')}</strong><span>{t('contactNotConfigured')}</span></span>
              </div>
            )}
            <div className="contact-method contact-method-hours">
              <span className="contact-method-icon"><Clock3 size={19} /></span>
              <span className="contact-method-copy">
                <strong>{t('hoursCardTitle')}</strong>
                <span>{lodge.openingHours || t('hoursNotConfirmed')}</span>
              </span>
            </div>
          </div>

          <section className="location-card" aria-labelledby="contact-map-heading">
            <div className="location-card-heading">
              <span className="eyebrow">{lodge.name}</span>
              <h2 id="contact-map-heading">{t('howToGetThere')}</h2>
              <p><span className="address-label">{lodge.fullAddress ? t('fullAddressLabel') : t('areaAddressLabel')}:</span> {placeAddress}</p>
            </div>
            <div className="contact-map-frame">
              <iframe
                title={t('contactMapTitle')}
                src={lodge.mapEmbed}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            <div className="location-card-actions">
              <a className="button" href={lodge.googleMapsLink} target="_blank" rel="noopener noreferrer">
                {t('directionsButton')} <ArrowUpRight size={16} />
              </a>
              <button className="button button-outline copy-plus-code" type="button" onClick={copyPlusCode}>
                {copyState === 'copied' ? <Check size={16} /> : <Copy size={16} />}
                {copyState === 'copied' ? t('copied') : t('copyPlusCode')}
              </button>
            </div>
            {copyState === 'error' && <p className="copy-feedback" role="status">{t('copyFailed')} {lodge.plusCode}</p>}
            <div className="plus-code-row">
              <MapPin size={17} aria-hidden="true" />
              <span>{t('plusCodeLabel')}<strong>{lodge.plusCode}</strong></span>
            </div>
            <div className="route-info">
              <h3>{t('howToGetThere')}</h3>
              <div className="route-info-grid">
                <div>
                  <strong>{t('fromHawassa')}</strong>
                  <span>{t('routeDistanceLabel')}: {routeValue(lodge.routeFromHawassa.distance)}</span>
                  <span>{t('routeTimeLabel')}: {routeValue(lodge.routeFromHawassa.travelTime)}</span>
                </div>
                <div>
                  <strong>{t('fromDilla')}</strong>
                  <span>{t('routeDistanceLabel')}: {routeValue(lodge.routeFromDilla.distance)}</span>
                  <span>{t('routeTimeLabel')}: {routeValue(lodge.routeFromDilla.travelTime)}</span>
                </div>
              </div>
            </div>
          </section>
        </aside>
      </section>
    </>
  )
}
