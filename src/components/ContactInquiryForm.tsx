import { useState, type FormEvent } from 'react'
import { ArrowUpRight, CheckCircle2 } from 'lucide-react'
import { getWhatsAppUrl, lodge } from '../data/lodge'
import { useI18n } from '../i18n/context'
import { InquiryConfigurationError, sendInquiry } from '../lib/sendInquiry'

interface ContactFormValues {
  fullName: string
  phone: string
  checkIn: string
  checkOut: string
  guests: string
  message: string
  website: string
}

type ContactField = keyof Omit<ContactFormValues, 'website'>
type FormErrors = Partial<Record<ContactField, string>>

const initialValues: ContactFormValues = {
  fullName: '',
  phone: '',
  checkIn: '',
  checkOut: '',
  guests: '2',
  message: '',
  website: '',
}

function localDateString(date = new Date()) {
  const offset = date.getTimezoneOffset()
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 10)
}

function validate(values: ContactFormValues, required: string, phoneInvalid: string, checkInPast: string, checkOutOrder: string): FormErrors {
  const errors: FormErrors = {}
  const fields: ContactField[] = ['fullName', 'phone', 'checkIn', 'checkOut', 'guests', 'message']
  for (const field of fields) {
    if (!values[field].trim()) errors[field] = required
  }

  const digits = values.phone.replace(/\D/g, '')
  if (values.phone.trim() && (digits.length < 7 || digits.length > 15 || !/^\+?[0-9][0-9\s().-]*$/.test(values.phone.trim()))) {
    errors.phone = phoneInvalid
  }
  if (values.checkIn && values.checkIn < localDateString()) errors.checkIn = checkInPast
  if (values.checkIn && values.checkOut && values.checkOut <= values.checkIn) errors.checkOut = checkOutOrder
  return errors
}

export function ContactInquiryForm() {
  const { t } = useI18n()
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<'success' | 'error' | 'config' | ''>('')
  const [sending, setSending] = useState(false)

  const update = (field: keyof ContactFormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    setStatus('')
  }

  const validateForm = () => {
    const nextErrors = validate(values, t('fieldRequired'), t('phoneInvalid'), t('checkInPast'), t('checkOutOrder'))
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const whatsappMessage = [
    `${t('whatsappInquiryIntro')} ${lodge.name}.`,
    `${t('fullName')}: ${values.fullName}`,
    `${t('phoneNumber')}: ${values.phone}`,
    `${t('checkInDate')}: ${values.checkIn}`,
    `${t('checkOutDate')}: ${values.checkOut}`,
    `${t('guestCount')}: ${values.guests}`,
    `${t('contactMessage')}: ${values.message}`,
  ].join('\n')
  const whatsappUrl = getWhatsAppUrl(whatsappMessage)

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('')

    if (!validateForm()) {
      document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
      return
    }
    if (values.website) {
      setValues(initialValues)
      setStatus('success')
      return
    }

    setSending(true)
    try {
      await sendInquiry({
        name: values.fullName,
        phone: values.phone,
        check_in: values.checkIn,
        check_out: values.checkOut,
        guests: values.guests,
        message: values.message,
        lodge: lodge.name,
      })
      setValues(initialValues)
      setErrors({})
      setStatus('success')
    } catch (error) {
      console.error('Unable to send contact inquiry:', error)
      setStatus(error instanceof InquiryConfigurationError ? 'config' : 'error')
    } finally {
      setSending(false)
    }
  }

  const fieldError = (field: ContactField) => errors[field] ? (
    <span className="contact-field-error" id={`contact-${field}-error`}>{errors[field]}</span>
  ) : null

  return (
    <form className="contact-inquiry-form" onSubmit={submit} noValidate>
      <div className="contact-form-grid">
        <label className="contact-field contact-field-wide" htmlFor="contact-full-name">
          {t('fullName')}
          <input
            id="contact-full-name"
            name="name"
            autoComplete="name"
            value={values.fullName}
            onChange={(event) => update('fullName', event.target.value)}
            required
            aria-invalid={Boolean(errors.fullName)}
            aria-describedby={errors.fullName ? 'contact-fullName-error' : undefined}
          />
          {fieldError('fullName')}
        </label>
        <label className="contact-field" htmlFor="contact-phone">
          {t('phoneNumber')}
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={(event) => update('phone', event.target.value)}
            required
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? 'contact-phone-error' : undefined}
          />
          {fieldError('phone')}
        </label>
        <label className="contact-field" htmlFor="contact-guests">
          {t('guestCount')}
          <select
            id="contact-guests"
            name="guests"
            value={values.guests}
            onChange={(event) => update('guests', event.target.value)}
            required
            aria-invalid={Boolean(errors.guests)}
            aria-describedby={errors.guests ? 'contact-guests-error' : undefined}
          >
            {Array.from({ length: 10 }, (_, index) => index + 1).map((count) => (
              <option key={count} value={String(count)}>{count}{count === 10 ? '+' : ''}</option>
            ))}
          </select>
          {fieldError('guests')}
        </label>
        <label className="contact-field" htmlFor="contact-check-in">
          {t('checkInDate')}
          <input
            id="contact-check-in"
            name="check_in"
            type="date"
            min={localDateString()}
            value={values.checkIn}
            onChange={(event) => update('checkIn', event.target.value)}
            required
            aria-invalid={Boolean(errors.checkIn)}
            aria-describedby={errors.checkIn ? 'contact-checkIn-error' : undefined}
          />
          {fieldError('checkIn')}
        </label>
        <label className="contact-field" htmlFor="contact-check-out">
          {t('checkOutDate')}
          <input
            id="contact-check-out"
            name="check_out"
            type="date"
            min={values.checkIn || localDateString()}
            value={values.checkOut}
            onChange={(event) => update('checkOut', event.target.value)}
            required
            aria-invalid={Boolean(errors.checkOut)}
            aria-describedby={errors.checkOut ? 'contact-checkOut-error' : undefined}
          />
          {fieldError('checkOut')}
        </label>
        <label className="contact-field contact-field-wide" htmlFor="contact-message">
          {t('contactMessage')}
          <textarea
            id="contact-message"
            name="message"
            rows={4}
            placeholder={t('contactMessagePlaceholder')}
            value={values.message}
            onChange={(event) => update('message', event.target.value)}
            required
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? 'contact-message-error' : undefined}
          />
          {fieldError('message')}
        </label>
      </div>
      <div className="contact-honeypot" aria-hidden="true">
        <label htmlFor="contact-website">{t('formHoneyLabel')}</label>
        <input id="contact-website" name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={(event) => update('website', event.target.value)} />
      </div>
      <div className="contact-form-actions">
        <button className="button" type="submit" disabled={sending}>
          {sending ? t('sendingInquiry') : t('sendInquiry')} <ArrowUpRight size={16} />
        </button>
        {whatsappUrl ? (
          <a className="button button-outline" href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            {t('inquireOnWhatsApp')}
          </a>
        ) : (
          <button className="button button-outline" type="button" disabled title={t('contactNotConfigured')}>
            {t('inquireOnWhatsApp')}
          </button>
        )}
      </div>
      <div className="contact-form-status" aria-live="polite" aria-atomic="true">
        {status === 'success' && <p className="form-status" role="status"><CheckCircle2 size={18} /> {t('formSuccess')}</p>}
        {status === 'error' && <p className="contact-submit-error" role="alert">{t('formSendError')}</p>}
        {status === 'config' && <p className="contact-submit-error" role="alert">{t('formConfigError')}</p>}
      </div>
    </form>
  )
}
