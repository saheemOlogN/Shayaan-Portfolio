# Shayaan Nakhwa — Portfolio

React + Vite, Motion, and official React Bits Aurora / BlurText components. Responsive layouts, accessible navigation, reduced-motion support, project disclosures, and downloadable resume.

## Run locally

```sh
npm install
npm run dev
```

Build: `npm run build`. Preview build: `npm run preview`.

## Add your images

Place photos in `public/images/`, then set the `images` object near the top of `src/main.jsx`. For example: `portrait: '/images/shayaan.webp'`. Keys: `portrait`, `nyrox`, `addvinci`, `timeshade`. Until set, the portfolio displays intentional graphic placeholders. Portrait crop is vertical; venture images use approximately square crops. Use compressed WebP images.

Edit resume-based copy in `src/main.jsx`, visual styling in `src/style.css`, and replace `public/Shayaan_Nakhwa_Resume.pdf` to update the download.

## Attribution

Aurora and BlurText are sourced from https://github.com/DavidHDev/react-bits (downloaded October 27, 2026). License retained in REACT-BITS-LICENSE.md. Icons: Lucide. Typography: DM Sans, Manrope (Google Fonts), with system fallbacks. Background is lazy-loaded, device pixel ratio is capped at 1, and disabled for reduced-motion preferences.
