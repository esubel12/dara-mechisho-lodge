export interface LodgeSocialLink {
  label: string
  url: string
}

export interface LodgeDetails {
  name: string
  phone: string
  phoneLink: string
  googleMapsLink: string
  latitude: number
  longitude: number
  plusCode: string
  mapEmbed: string
  fullAddress: string
  area: string
  addressLocality: string
  addressRegion: string
  addressCountry: string
  email: string
  whatsappNumber: string
  telegramHandle: string
  socialLinks: LodgeSocialLink[]
  openingHours: string
  routeFromHawassa: { distance: string; travelTime: string }
  routeFromDilla: { distance: string; travelTime: string }
}

export const lodge: LodgeDetails = {
  name: 'Dara Mechisho Hot Spring Lodge',
  phone: '071 695 0827',
  phoneLink: '+251716950827',
  googleMapsLink: 'https://maps.app.goo.gl/HicmQMeb35Xt2K3j6',
  latitude: 6.393003,
  longitude: 38.268692,
  plusCode: 'H64X+86',
  mapEmbed: 'https://maps.google.com/maps?q=6.393003,38.268692&z=15&output=embed',
  // TODO: Add the lodge's confirmed full street/postal address.
  fullAddress: '',
  area: 'Mechisho, Sidama Region, Ethiopia',
  addressLocality: 'Mechisho',
  addressRegion: 'Sidama Region',
  addressCountry: 'ET',
  // TODO: Add the lodge's public contact email.
  email: '',
  // TODO: Add a verified WhatsApp number in international format, digits only.
  whatsappNumber: '',
  // TODO: Add the lodge's Telegram handle without the @ sign.
  telegramHandle: '',
  // TODO: Add verified public profile URLs.
  socialLinks: [],
  // TODO: Confirm opening days and hours with the lodge.
  openingHours: '',
  // TODO: Confirm road distance and typical travel time from Hawassa.
  routeFromHawassa: { distance: '', travelTime: '' },
  // TODO: Confirm road distance and typical travel time from Dilla.
  routeFromDilla: { distance: '', travelTime: '' },
}

export function getWhatsAppUrl(message?: string) {
  const number = lodge.whatsappNumber.replace(/\D/g, '')
  if (!number) return null
  const url = new URL(`https://wa.me/${number}`)
  if (message) url.searchParams.set('text', message)
  return url.href
}

export function getTelegramUrl() {
  return lodge.telegramHandle ? `https://t.me/${lodge.telegramHandle.replace(/^@/, '')}` : null
}
