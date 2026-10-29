# Dara Mechisho Hot Spring Lodge

A mobile-first, static React website for a natural hot spring and lodge in Mechisho, Sidama Region, Ethiopia. The site is designed to make it easy to learn about the lodge and start a booking inquiry; it does not take online payments.

## Requirements

- Node.js 20.19+ or 22.12+
- npm

## Run locally

```bash
npm install
Copy-Item .env.example .env.local
npm run dev
```

Open the local URL printed by Vite. To enable contact form delivery, configure `.env.local` using `.env.example`:

- **Formspree:** set `VITE_FORM_PROVIDER=formspree` and `VITE_FORM_ENDPOINT` to the lodge’s Formspree form endpoint.
- **EmailJS:** set `VITE_FORM_PROVIDER=emailjs`, `VITE_FORM_ENDPOINT=https://api.emailjs.com/api/v1.0/email/send`, plus the EmailJS service ID, template ID and public key. Configure the EmailJS template to use the submitted `name`, `phone`, `check_in`, `check_out`, `guests`, `message` and `lodge` fields.

The Contact page also provides a prefilled WhatsApp inquiry link once the lodge’s WhatsApp number is configured. EmailJS public keys and all variables prefixed with `VITE_` are bundled into the public website; never put private credentials in them.

## Build and preview

```bash
npm run build
npm run preview
```

The production files are written to `dist/`. `npm run lint` runs Oxlint.

## Deploy

### Netlify

1. Import the repository in Netlify.
2. Set the build command to `npm run build` and publish directory to `dist`.
3. Add the selected form provider and endpoint variables under **Site configuration → Environment variables**.
4. Configure the custom domain, then replace the `example.com` entries in `public/robots.txt` and `public/sitemap.xml`.

The `netlify.toml` file provides the SPA route fallback.

### Vercel

1. Import the repository in Vercel; select the Vite preset.
2. Set the build command to `npm run build` and output directory to `dist`.
3. Add the selected form provider and endpoint variables in the project’s environment variables.
4. Configure the production domain and update the sitemap and robots file to use it.

The `vercel.json` file provides the SPA route fallback.

## Content editing

- **Lodge name, phone, map link, coordinates, Plus Code, address, email, messaging, social profiles, hours and route details:** edit the typed object in `src/data/lodge.ts`. Unknown email, WhatsApp, Telegram, social, full-address, hours and route fields are intentionally blank and display as unconfigured until confirmed.
- **Rooms, room rates, facilities, activities and FAQs:** edit the typed arrays in `src/data/content.ts`. Replace “Price on request” with owner-approved rates and confirm all amenities and visitor guidance.
- **English and Amharic interface copy:** `src/i18n/I18n.tsx`. The navbar language control switches the interface language and remembers the selection in local storage.
- **Page copy and section order:** `src/pages/Pages.tsx`.
- **Design tokens and responsive styles:** `tailwind.config.js` and `src/index.css`.
- **SEO:** page titles/descriptions update per route. LodgingBusiness JSON-LD reads contact and geo details from `src/data/lodge.ts`; update `public/sitemap.xml` and `public/robots.txt` to the final domain.
- **Photos:** replace the illustrative `images.unsplash.com` URLs in `src/data/content.ts` and `src/pages/Pages.tsx` with lodge-owned images. Use compressed WebP images, descriptive alt text and responsive variants where available. All gallery and below-the-fold content images are lazy-loaded.
- **Guest reviews:** add only verified guest feedback with permission; the home page currently uses a clearly labelled placeholder instead of invented testimonials.

## Routes

`/` home · `/about` · `/hot-springs` · `/rooms` · `/gallery` · `/dining` · `/contact` · `/faq`

Unknown routes show a custom 404 page. Direct navigation to client routes requires the SPA fallback included for Netlify and Vercel.

## Client launch checklist

- [ ] Lodge-owned, high-resolution photos: hot spring pools, exterior, rooms, dining, team and local scenery; confirm permission to publish.
- [ ] Final room names, facilities, occupancy, availability and nightly prices.
- [ ] Confirmed day-visit pricing, inclusions, rules and child/group rates.
- [ ] Verified opening hours, check-in/check-out times, seasonal closures and booking response expectations.
- [ ] Exact written address, pin/coordinates, Plus Code and recommended directions.
- [ ] Confirm whether the supplied phone supports WhatsApp; add its international number, public email, Telegram handle and social profile links.
- [ ] Lodge history, team names/roles, dining menu, coffee ceremony details, event/tour offerings and accessibility information.
- [ ] Verified guest testimonials and permission to publish names/photos, if desired.
- [ ] Public website domain and matching sitemap/robots URLs; final business details for structured data.
- [ ] Choose Formspree or EmailJS, provide the form endpoint and configure recipient notifications/template fields.
