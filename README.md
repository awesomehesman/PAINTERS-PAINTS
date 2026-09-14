# Painters & Paints

A responsive static HTML/CSS/JavaScript website with a filterable inspiration gallery, accessible image dialog, 1–4× zoom, pan/pinch controls and a WhatsApp enquiry form.

## Business setup

Edit `business-config.js` to set `whatsappNumber` (international digits only, no + or spaces) and `serviceArea`. Both intentionally start blank. No enquiry is sent or stored by the site. Customers review and send the prepared message in WhatsApp. Verify the number before public release.

## Local work

Use Node 22.13 or newer. Run `npm ci`, `npm run dev`, `npm test`, and `npm run build`. The build emits a self-contained Cloudflare-compatible ESM Worker at `dist/server/index.js` plus static assets in `dist/client`. Social URLs are resolved from the incoming host by the Worker.

## Imagery

Sources and credits are in `image-credits.html` and `gallery-data.js`. AI images are labelled inspiration, never completed projects. Optimised WebP files are in `public/images`; original assets are kept in `assets/source`. Image generation is not needed at runtime.

## Validation

Node/jsdom checks cover filters, image navigation, focus restoration/trapping, keyboard controls, zoom limits, pinch/pan geometry, errors, form states, encoding and image decoding. These checks simulate DOM interactions; they do not replace real-browser visual or physical-device testing. The connected browser was unavailable in the implementation session.

The site is intended for an owner-private Sites preview. Public release requires confirmed business contact details and explicit approval of public access.
