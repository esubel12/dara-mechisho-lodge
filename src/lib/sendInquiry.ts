export type InquiryPayload = Record<string, string>

export class InquiryConfigurationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'InquiryConfigurationError'
  }
}

export async function sendInquiry(payload: InquiryPayload) {
  const provider = import.meta.env.VITE_FORM_PROVIDER?.trim().toLowerCase() || 'formspree'
  const endpoint = import.meta.env.VITE_FORM_ENDPOINT?.trim()

  if (!endpoint) throw new InquiryConfigurationError('Inquiry form endpoint is not configured.')

  let requestBody: object
  if (provider === 'formspree') {
    requestBody = payload
  } else if (provider === 'emailjs') {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID?.trim()
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID?.trim()
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY?.trim()
    if (!serviceId || !templateId || !publicKey) {
      throw new InquiryConfigurationError('EmailJS service, template and public key must be configured.')
    }
    requestBody = {
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      template_params: payload,
    }
  } else {
    throw new InquiryConfigurationError(`Unsupported inquiry form provider: ${provider}`)
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  })

  if (!response.ok) {
    throw new Error(`Inquiry request failed with status ${response.status}.`)
  }
}
