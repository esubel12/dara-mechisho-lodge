import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BedDouble,
  Coffee,
  Compass,
  Leaf,
  MapPin,
  Mountain,
  ShieldCheck,
  Sparkles,
  Waves,
  X,
} from 'lucide-react'
import { activities, faqs, galleryImages, highlights, rooms } from '../data/content'
import { lodge } from '../data/lodge'
import { responsiveImageSet } from '../data/images'
import { useI18n } from '../i18n/context'
import { InquiryForm } from '../components/InquiryForm'
import { Seo } from '../components/Seo'
import { ContactLocation } from '../components/ContactLocation'

const icons = { waves: Waves, bed: BedDouble, coffee: Coffee, mountain: Mountain }

function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduceMotion = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return <span className={`eyebrow ${light ? 'eyebrow-light' : ''}`}>{children}</span>
}

function SectionHeading({ eyebrow, title, text, centered = false }: { eyebrow: string; title: string; text?: string; centered?: boolean }) {
  return (
    <div className={`section-heading ${centered ? 'text-center' : ''}`}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  )
}

// TODO: Use approved lodge-owned photos for each page header before launch.
function PageIntro({ eyebrow, title, text, image }: { eyebrow: string; title: string; text: string; image: string }) {
  return (
    <section className="page-intro">
      <img className="page-intro-image" src={image} srcSet={responsiveImageSet(image)} sizes="100vw" alt="" aria-hidden="true" />
      <div className="page-intro-content">
        <Eyebrow light>{eyebrow}</Eyebrow>
        <h1>{title}</h1>
        <p>{text}</p>
      </div>
    </section>
  )
}

function CtaBand({ title, text, button = 'Send an inquiry', href = '/contact' }: { title: string; text: string; button?: string; href?: string }) {
  return (
    <section className="cta-band">
      <div>
        <Eyebrow light>Come find your calm</Eyebrow>
        <h2>{title}</h2>
        <p>{text}</p>
      </div>
      <a className="button button-light" href={href}>{button} <ArrowUpRight size={16} /></a>
    </section>
  )
}

function RoomCard({ room, compact = false }: { room: (typeof rooms)[number]; compact?: boolean }) {
  return (
    <article className={`room-card ${compact ? 'room-card-compact' : ''}`}>
      <div className="room-image-wrap">
        <img src={room.image} srcSet={responsiveImageSet(room.image)} sizes="(max-width: 680px) calc(100vw - 40px), (max-width: 920px) 33vw, 33vw" alt={`${room.name} — illustrative room photograph, replace with lodge photo`} loading="lazy" />
        <span className="room-price">{room.price}</span>
      </div>
      <div className="room-card-content">
        <div className="room-title-row"><h3>{room.name}</h3><span>Stay</span></div>
        <p>{room.description}</p>
        <ul className="amenity-list">{room.amenities.map((amenity) => <li key={amenity}>{amenity}</li>)}</ul>
        <a className="text-link" href="/contact#inquiry">Ask about this room <ArrowRight size={15} /></a>
      </div>
    </article>
  )
}

export function HomePage() {
  const { t } = useI18n()
  return (
    <>
      <Seo title="A natural hot spring escape in Sidama" description="Discover Dara Mechisho Hot Spring Lodge in Ethiopia’s Sidama region. Inquire about hot spring day visits, rooms and local experiences." />
      <section className="home-hero">
        <img className="hero-image" src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=2200&q=82" srcSet={responsiveImageSet('https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=2200&q=82')} sizes="100vw" alt="Illustrative green mountain landscape; replace with a real Dara Mechisho lodge photograph" fetchPriority="high" />
        <div className="hero-shade" />
        <div className="hero-content">
          <Eyebrow light>{t('heroEyebrow')} · {lodge.plusCode}</Eyebrow>
          <h1>{t('heroTitle')}</h1>
          <p>{t('heroText')}</p>
          <div className="hero-actions">
            <a className="button button-light" href="#inquiry">{t('inquire')} <ArrowUpRight size={16} /></a>
            <a className="hero-secondary" href="/hot-springs">{t('explore')} <ArrowRight size={16} /></a>
          </div>
        </div>
        <a className="hero-scroll" href="#welcome"><span>Scroll to discover</span><ArrowDown size={16} /></a>
        <span className="hero-caption">Illustrative image · replace with lodge photography</span>
      </section>

      <section className="welcome-section section-pad" id="welcome">
        <div className="welcome-photo-wrap">
          <img src="https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1100&q=78" srcSet={responsiveImageSet('https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1100&q=78')} sizes="(max-width: 680px) calc(100vw - 40px), 50vw" alt="Illustrative water detail; replace with a photograph of the lodge hot springs" loading="lazy" />
          <div className="photo-caption"><Waves size={16} /> A natural pause in Sidama</div>
          <span className="photo-stamp"><span>Slow</span><span>down</span></span>
        </div>
        <div className="welcome-copy">
          <Eyebrow>Rooted in the Sidama landscape</Eyebrow>
          <h2>{t('aboutTitle')}</h2>
          <p>{t('aboutText')}</p>
          <p className="muted-copy">Whether you come for a restorative soak, an unhurried night or the pleasure of a shared coffee, we look forward to welcoming you.</p>
          <a className="text-link" href="/about">{t('aboutLink')} <ArrowRight size={16} /></a>
        </div>
      </section>

      <section className="highlights-section section-pad">
        <div className="content-width">
          <SectionHeading eyebrow="The lodge experience" title={t('sectionHighlights')} text={t('sectionHighlightsText')} centered />
          <div className="highlight-grid">
            {highlights.map((item) => {
              const Icon = icons[item.icon as keyof typeof icons]
              return <Reveal key={item.title} className="highlight-card">
                <span className="highlight-icon"><Icon size={23} strokeWidth={1.6} /></span>
                <h3>{item.title}</h3><p>{item.description}</p>
                <a href={item.icon === 'bed' ? '/rooms' : item.icon === 'coffee' ? '/dining' : '/hot-springs'} aria-label={`Learn more about ${item.title}`}><ArrowUpRight size={17} /></a>
              </Reveal>
            })}
          </div>
        </div>
      </section>

      <section className="rooms-section section-pad">
        <div className="content-width">
          <div className="section-heading-row">
            <SectionHeading eyebrow="Rest well, wake refreshed" title={t('roomsTitle')} text={t('roomsText')} />
            <a className="text-link desktop-link" href="/rooms">{t('viewRooms')} <ArrowRight size={16} /></a>
          </div>
          <div className="room-grid">{rooms.map((room) => <RoomCard key={room.name} room={room} compact />)}</div>
          <a className="text-link mobile-link" href="/rooms">{t('viewRooms')} <ArrowRight size={16} /></a>
        </div>
      </section>

      <section className="story-strip">
        <div className="story-image"><img src="https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1400&q=78" srcSet={responsiveImageSet('https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1400&q=78')} sizes="(max-width: 680px) 100vw, 50vw" alt="Illustrative forest landscape; replace with a photograph of the local area" loading="lazy" /></div>
        <div className="story-copy">
          <Eyebrow light>A thoughtful kind of escape</Eyebrow>
          <h2>{t('guestStories')}</h2>
          <p>{t('guestStoriesText')}</p>
          <span className="story-note">Guest stories will be added with permission.</span>
        </div>
      </section>

      <section className="gallery-preview section-pad">
        <div className="content-width">
          <div className="section-heading-row">
            <SectionHeading eyebrow="Moments at Dara Mechisho" title={t('galleryTitle')} text={t('galleryText')} />
            <a className="text-link desktop-link" href="/gallery">{t('seeGallery')} <ArrowRight size={16} /></a>
          </div>
          <div className="preview-grid">
            {galleryImages.slice(0, 3).map((photo) => <a href="/gallery" className="preview-photo" key={photo.label}><img src={photo.src} srcSet={responsiveImageSet(photo.src)} sizes="(max-width: 680px) 50vw, 33vw" alt={photo.alt} loading="lazy" /><span>{photo.label}</span></a>)}
          </div>
          <a className="text-link mobile-link" href="/gallery">{t('seeGallery')} <ArrowRight size={16} /></a>
        </div>
      </section>

      <section className="location-strip">
        <div className="location-map-card">
          <div className="map-decoration"><MapPin size={30} /><span>MECHISHO<br />SIDAMA, ETHIOPIA</span></div>
          <span className="map-code">{lodge.plusCode}</span>
        </div>
        <div className="location-copy">
          <Eyebrow>A warm welcome, close to nature</Eyebrow>
          <h2>{t('locationTitle')}</h2>          <p>{t('locationText').replace('{plusCode}', lodge.plusCode)}</p>
          <div className="location-detail"><MapPin size={17} /><span>{lodge.area}<small>Plus Code {lodge.plusCode}</small></span></div>
          <a className="text-link" href={lodge.googleMapsLink} target="_blank" rel="noopener noreferrer">{t('getDirections')} <ArrowUpRight size={16} /></a>
        </div>
      </section>

      <section className="inquiry-section section-pad" id="inquiry">
        <div className="inquiry-intro">
          <Eyebrow>Start planning</Eyebrow>
          <h2>{t('finalTitle')}</h2><p>{t('finalText')}</p>
          <div className="inquiry-phone"><span>Prefer to speak with us?</span><a href={`tel:${lodge.phoneLink}`}>{lodge.phone}</a></div>
        </div>
        <div className="inquiry-form-card"><InquiryForm /></div>
      </section>
    </>
  )
}

export function AboutPage() {
  return <>
    <Seo title="Our story" description="Learn about Dara Mechisho Hot Spring Lodge, its Sidama setting, natural springs and welcoming approach to hospitality." />
    <PageIntro eyebrow="Welcome to Dara Mechisho" title="A place shaped by warmth." text="A natural pause in Sidama, where the springs, the landscape and the kindness of a welcome come together." image="https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1900&q=80" />
    <section className="split-story section-pad content-width">
      <div><Eyebrow>Our story</Eyebrow><h2>Hospitality, grounded in place.</h2></div>
      <div className="long-copy"><p>Dara Mechisho Hot Spring Lodge is a place to experience the restorative warmth of the springs and the generous spirit of Sidama. Set in Mechisho, the lodge welcomes day visitors and overnight guests looking to slow down and reconnect with nature.</p><p>Our story belongs to the people and place around us. We invite visitors to enjoy a thoughtful stay, discover local flavours and explore the landscape at an unhurried pace.</p><p className="editorial-note">Lodge history and founding details are being confirmed with the owners. This section can be updated with their own story.</p></div>
    </section>
    <section className="values-section section-pad"><div className="content-width"><SectionHeading eyebrow="What guides us" title="The welcome is part of the experience." text="The simple things matter: a thoughtful welcome, care for the setting and genuine respect for local culture." /><div className="value-grid">{[
      { icon: Leaf, title: 'Care for our place', text: 'We value the springs and natural surroundings that make Mechisho special.' },
      { icon: Sparkles, title: 'Warm hospitality', text: 'Every guest deserves a welcoming, attentive and comfortable experience.' },
      { icon: ShieldCheck, title: 'Respect and care', text: 'We aim to host with respect for local traditions, our community and one another.' },
    ].map(({ icon: Icon, title, text }) => <article className="value-card" key={title}><Icon size={23} /><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>
    <section className="team-section section-pad content-width"><div className="team-photo"><img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=78" srcSet={responsiveImageSet('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=78')} sizes="(max-width: 680px) 100vw, 50vw" alt="Illustrative hospitality setting; replace with a portrait of the lodge team" loading="lazy" /></div><div><Eyebrow>Meet you at the lodge</Eyebrow><h2>A local welcome, from the people who know this place.</h2><p>Our team is here to help you plan a restorative visit, answer questions and share what’s special about the area.</p><a className="text-link" href="/contact">Say hello <ArrowRight size={16} /></a></div></section>
    <CtaBand title="We look forward to welcoming you." text="Get in touch to ask about a day visit or an overnight stay." />
  </>
}

export function SpringsPage() {
  const { t } = useI18n()
  return <>
    <Seo title="Hot springs and experiences" description="Plan a hot spring day visit to Dara Mechisho in Sidama. Check current opening hours, visitor guidance and pricing by inquiry." />
    <PageIntro eyebrow="Rest, restore, reconnect" title="Let the warm water slow you down." text="Enjoy a restorative pause in the natural setting of Mechisho. Contact us before your visit for current access and day-use details." image="https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1900&q=80" />
    <section className="section-pad content-width spring-intro"><div className="spring-image"><img src="https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=78" srcSet={responsiveImageSet('https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=78')} sizes="(max-width: 680px) 100vw, 50vw" alt="Illustrative water scenery; replace with a real photograph of the hot spring pools" loading="lazy" /></div><div><Eyebrow>The natural springs</Eyebrow><h2>A restorative ritual, surrounded by nature.</h2><p>Take a moment to settle into the warmth and enjoy the quiet of the landscape. Our team can help you with current pool access, facilities and the best time to visit.</p><div className="hours-card"><span className="hours-icon"><Waves size={20} /></span><span><strong>{lodge.openingHours || t('hoursNotConfirmed')}</strong><small>Hours are subject to change. Please call ahead.</small></span></div></div></section>
    <section className="visitor-info section-pad"><div className="content-width visitor-grid"><div><Eyebrow>Plan a day visit</Eyebrow><h2>Easy to plan, lovely to remember.</h2><p>Day visitors are welcome subject to availability. Rates can change, so contact the lodge for the latest entry price and pool access before setting out.</p><div className="price-placeholder"><span>Day-visit pricing</span><strong>Confirm directly with the lodge</strong><small>TODO: Add confirmed adult, child and group rates.</small></div><a className="button" href="/contact#inquiry">Ask about a visit <ArrowUpRight size={15} /></a></div><div className="rules-card"><h3>A few thoughtful reminders</h3><ul className="check-list"><li>Bring swimwear, a towel, sandals and a change of clothes.</li><li>Follow posted signs and the team’s guidance around the pools.</li><li>Supervise children closely near the water at all times.</li><li>Respect other guests and help us keep the setting clean.</li><li>Ask the team before bringing food, drinks or glass containers.</li></ul></div></div></section>
    <section className="activities-section section-pad content-width"><SectionHeading eyebrow="Beyond the water" title="Make a little more of your visit." /><div className="activity-grid">{activities.map(({ title, description }, index) => <article key={title} className="activity-card"><span>0{index + 1}</span><Compass size={23} /><h3>{title}</h3><p>{description}</p></article>)}</div></section>
    <CtaBand title="Questions before you set off?" text="Call us to confirm today’s access, hours and day-visit rates." button={`Call ${lodge.phone}`} href={`tel:${lodge.phoneLink}`} />
  </>
}

export function RoomsPage() {
  return <>
    <Seo title="Rooms and accommodation" description="Explore accommodation at Dara Mechisho Hot Spring Lodge. Room rates and availability are confirmed directly with the lodge." />
    <PageIntro eyebrow="Stay a while" title="Rest easy in Sidama." text="A comfortable room, an easy pace and the natural warmth of Mechisho. Ask us about room availability and current rates." image="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1900&q=80" />
    <section className="section-pad content-width"><div className="section-heading-row"><SectionHeading eyebrow="Find your place to pause" title="Rooms for a restful stay." text="Choose the space that suits your visit. We’ll confirm details and prices when you inquire." /><span className="price-badge">Rates available on request</span></div><div className="room-grid full-room-grid">{rooms.map((room) => <RoomCard key={room.name} room={room} />)}</div><p className="editorial-note">Room names, amenities and photographs are placeholders pending confirmation by the lodge. Please inquire for current availability, occupancy and final rates.</p></section>
    <CtaBand title="Find the right room for your visit." text="Let us know your dates and group size and we’ll be happy to help." />
  </>
}

export function GalleryPage() {
  const [selected, setSelected] = useState<number | null>(null)
  const closeButton = useRef<HTMLButtonElement>(null)
  const triggerButton = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (selected === null) {
      triggerButton.current?.focus()
      return
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButton.current?.focus()
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelected(null)
      if (event.key === 'ArrowRight') setSelected((value) => value === null ? null : (value + 1) % galleryImages.length)
      if (event.key === 'ArrowLeft') setSelected((value) => value === null ? null : (value - 1 + galleryImages.length) % galleryImages.length)
      if (event.key === 'Tab') {
        const buttons = document.querySelectorAll<HTMLButtonElement>('.lightbox button')
        const first = buttons[0]
        const last = buttons[buttons.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last?.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first?.focus()
        }
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.style.overflow = previousOverflow
    }
  }, [selected])
  return <>
    <Seo title="Gallery" description="See a glimpse of the landscape, accommodation and experiences around Dara Mechisho Hot Spring Lodge. Lodge photographs to be added." />
    <PageIntro eyebrow="A glimpse of the journey" title="A slower kind of beautiful." text="A first look at the restful moments, natural beauty and warm welcome waiting in Sidama." image="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1900&q=80" />
    <section className="section-pad content-width"><div className="gallery-note"><Sparkles size={17} /><p>These illustrative images are temporary. Lodge photography will be added before launch.</p></div><div className="gallery-grid">{galleryImages.map((photo, index) => <button className={`gallery-tile gallery-tile-${index % 4}`} type="button" key={photo.label} onClick={(event) => { triggerButton.current = event.currentTarget; setSelected(index) }} aria-label={`View image: ${photo.label}`}><img src={photo.src} srcSet={responsiveImageSet(photo.src)} sizes="(max-width: 680px) 50vw, 33vw" alt={photo.alt} loading="lazy" /><span>{photo.label}<ArrowUpRight size={15} /></span></button>)}</div></section>
    {selected !== null && <div className="lightbox" role="dialog" aria-modal="true" aria-label="Gallery image" onClick={() => setSelected(null)}><button ref={closeButton} type="button" className="lightbox-close" onClick={() => setSelected(null)} aria-label="Close image"><X size={25} /></button><figure onClick={(event) => event.stopPropagation()}><img src={galleryImages[selected].src} srcSet={responsiveImageSet(galleryImages[selected].src)} sizes="90vw" alt={galleryImages[selected].alt} /><figcaption>{galleryImages[selected].label}</figcaption></figure><button className="lightbox-next" type="button" aria-label="Next image" onClick={(event) => { event.stopPropagation(); setSelected((selected + 1) % galleryImages.length) }}><ArrowRight size={22} /></button></div>}
    <CtaBand title="Come see Sidama for yourself." text="We’d be delighted to help you plan a visit." />
  </>
}

export function DiningPage() {
  return <>
    <Seo title="Dining and local experiences" description="Discover dining, Ethiopian coffee, events and local experiences at Dara Mechisho Hot Spring Lodge in Sidama." />
    <PageIntro eyebrow="A taste of Sidama" title="Gather, savour, take your time." text="Good food and good company belong to a restorative getaway. Ask us what’s available during your visit." image="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1900&q=80" />
    <section className="dining-intro section-pad content-width"><div><Eyebrow>At the lodge</Eyebrow><h2>Simple pleasures, shared generously.</h2><p>From a relaxed meal to the warmth of an Ethiopian coffee ceremony, make room for the flavours and traditions that make this region special.</p><p>Menus, service times and dietary options can vary. Please let us know what you need when you inquire.</p></div><div className="dining-photo"><img src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1100&q=78" srcSet={responsiveImageSet('https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1100&q=78')} sizes="(max-width: 680px) 100vw, 50vw" alt="Illustrative fresh local ingredients; replace with a real lodge dining photograph" loading="lazy" /><span>Illustrative image — lodge dining photos to come</span></div></section>
    <section className="experience-section section-pad"><div className="content-width"><SectionHeading eyebrow="Make it your own" title="Experiences to remember." text="Ask our team about planning a little more around your time at the springs." /><div className="experience-grid">{[
      { icon: Coffee, label: 'Coffee ceremony', title: 'The art of slowing down', text: 'Set aside time for the Ethiopian coffee ritual: freshly prepared coffee, a welcoming gathering and a moment to linger.' },
      { icon: Sparkles, label: 'Events & gatherings', title: 'A place to come together', text: 'Planning a small celebration or group visit? Contact us to discuss the space, arrangements and availability.' },
      { icon: Mountain, label: 'Local experiences', title: 'Discover the region', text: 'We can help you ask about nearby walks, viewpoints and community experiences available during your stay.' },
    ].map(({ icon: Icon, label, title, text }) => <article className="experience-card" key={label}><Icon size={24} /><span>{label}</span><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>
    <CtaBand title="Tell us what you’re celebrating." text="We’ll help you explore the options for dining and experiences." />
  </>
}

export function ContactPage() {
  const { t } = useI18n()
  return <>
    <Seo title={t('contactSeoTitle')} description={t('contactSeoDescription')} />
    <PageIntro eyebrow={t('contactHeroEyebrow')} title={t('contactHeroTitle')} text={t('contactHeroSubtitle')} image="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1900&q=80" />
    <ContactLocation />
  </>
}

export function FaqPage() {
  return <>
    <Seo title="Frequently asked questions" description="Answers to common questions about hot spring visits, rooms, payment, what to bring and directions to Dara Mechisho Hot Spring Lodge." />
    <PageIntro eyebrow="A few helpful details" title="Good to know before you go." text="Answers to common questions about visiting and staying at Dara Mechisho. If you need anything else, just get in touch." image="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1900&q=80" />
    <section className="faq-section section-pad content-width"><div className="faq-aside"><Eyebrow>Questions, answered</Eyebrow><h2>Plan with confidence.</h2><p>Still wondering about something? Our team can help with the details.</p><a className="text-link" href="/contact">Contact the lodge <ArrowRight size={16} /></a></div><div className="faq-list">{faqs.map((item, index) => <details className="faq-item" key={item.question} open={index === 0}><summary><span>{item.question}</span><span className="faq-plus">+</span></summary><p>{item.answer.replace('{plusCode}', lodge.plusCode)}</p></details>)}</div></section>
    <CtaBand title="Have another question?" text="Call us or send a quick inquiry. We’re happy to help." button={`Call ${lodge.phone}`} href={`tel:${lodge.phoneLink}`} />
  </>
}

export function NotFoundPage() {
  return <section className="not-found"><Seo title="Page not found" description="We couldn’t find that page. Explore Dara Mechisho Hot Spring Lodge or contact us to plan your visit." /><div className="not-found-mark"><Waves size={36} /></div><Eyebrow>404 · PAGE NOT FOUND</Eyebrow><h1>This path took a different turn.</h1><p>The page you’re looking for may have moved. Let’s get you back to the lodge.</p><div><a className="button" href="/">Return home <ArrowRight size={16} /></a><a className="text-link" href="/contact">Contact the lodge <ArrowUpRight size={15} /></a></div></section>
}
