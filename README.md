# ParcelX New Pages — Fulfillment

A standalone React + Vite implementation of the ParcelX Fulfillment landing page, isolated from the main ParcelX app.

## Run locally
```bash
npm install
npm run dev
```
Production build: `npm run build`

## Image assets
Copy the existing image assets into `public/images/fullfillment/` (folder spelling matches the asset path). The page includes graceful visual fallbacks if an image is missing.

Expected files:
- `fulfillment-hero-warehouse.png`
- `fulfillment-technology-person-dashboard.png`
- `fulfillment-dashboard-laptop.png`
- `faq-parcel-help.png`
- `blog-shipping-aggregator.png`
- `blog-efficient-packing.png`
- `blog-move-made-easy.png`

## Notes
- Responsive layout for desktop and mobile
- Instrument Sans typography and ParcelX orange (#FF6600)
- Interactive mobile navigation and FAQ accordion
- Review/confirm performance metrics and service claims with the product team before publishing
