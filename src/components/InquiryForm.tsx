import { useState, type FormEvent } from 'react'
import { ArrowUpRight, CheckCircle2 } from 'lucide-react'
import { getWhatsAppUrl, lodge } from '../data/lodge'
import { useI18n } from '../i18n/context'
import { InquiryConfigurationError, sendInquiry } from '../lib/sendInquiry'

interface FormValues {
  name: string
  phone: string
  dates: string
  guests: string
  message: string
}

const initialValues: FormValues = {
  name: '',
  phone: '',
  dates: '',
  guests: '2',
  message: '',
}

function messageFor(values: FormValues, t: ReturnType<typeof useI18n>['t']) {
  return [
    `${t('whatsappInquiryIntro')} ${lodge.name}.`,
    `${t('fullName')}: ${values.name}`,
    `${t('phoneNumber')}: ${values.phone}`,
    `${t('checkInDate')}: ${values.dates || 'Not specified'}`,
    `${t('guestCount')}: ${values.guests}`,
    `${t('contactMessage')}: ${values.message || 'Please share availability and prices.'}`,
  ].join('\n')
}

export function InquiryForm() {
  const { t } = useI18n()
  const [values, setValues] = useState(initialValues)
  const [status, setStatus] = useState('')
  const [sending, setSending] = useState(false)
  const endpoint = import.meta.env.VITE_FORM_ENDPOINT

  const update = (field: keyof FormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }))
    setStatus('')
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('')
    if (!endpoint) {
      const url = getWhatsAppUrl(messageFor(values, t))
      if (!url) {
        setStatus(t('formConfigError'))
        return
      }
      window.open(url, '_blank', 'noopener,noreferrer')
      setStatus(t('formWhatsAppReady'))
      return
    }

    setSending(true)
    try {
      await sendInquiry({ ...values, lodge: lodge.name })
      setValues(initialValues)
      setStatus(t('formSuccess'))
    } catch (error) {
      console.error('Unable to send lodge inquiry:', error)
      setStatus(error instanceof InquiryConfigurationError ? t('formConfigError') : t('formSendError'))
    } finally {
      setSending(false)
    }
  }

  return (
    <form className="inquiry-form" onSubmit={submit}>
      <div className="form-grid">
        <label>{t('formName')}<input required autoComplete="name" value={values.name} onChange={(event) => update('name', event.target.value)} /></label>
        <label>{t('formPhone')}<input required type="tel" autoComplete="tel" value={values.phone} onChange={(event) => update('phone', event.target.value)} /></label>
        <label>{t('formDates')}<input type="text" placeholder="e.g. 12–14 November" value={values.dates} onChange={(event) => update('dates', event.target.value)} /></label>
        <label>{t('formGuests')}<select value={values.guests} onChange={(event) => update('guests', event.target.value)}>
          {Array.from({ length: 10 }, (_, index) => index + 1).map((count) => <option key={count} value={String(count)}>{count}{count === 10 ? '+' : ''}</option>)}
        </select></label>
        <label className="form-wide">{t('formMessage')}<textarea rows={4} value={values.message} onChange={(event) => update('message', event.target.value)} /></label>
      </div>
      <p className="form-note">{t('formConsent')}</p>
      <div className="form-actions">
        <button className="button" type="submit" disabled={sending}>{sending ? 'Sending…' : t('formSubmit')} <ArrowUpRight size={16} /></button>
        {getWhatsAppUrl() ? (
          <a className="button button-outline" href={getWhatsAppUrl(messageFor(values, t))!} target="_blank" rel="noopener noreferrer">{t('formWhatsApp')}</a>
        ) : (
          <button className="button button-outline" type="button" disabled title="WhatsApp contact details are not configured yet">{t('formWhatsApp')}</button>
        )}
      </div>
      {status && <p className="form-status" role="status"><CheckCircle2 size={17} /> {status}</p>}
    </form>
  )
}
