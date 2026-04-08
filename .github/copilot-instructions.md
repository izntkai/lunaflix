# Lunaflix Project Guidelines

## Code Style
- Use JavaScript ES modules and React function components throughout the app.
- Keep changes lint-clean against [eslint.config.js](eslint.config.js) and follow the existing file-local style in `src/`.
- Prefer small, focused components in `src/components/` and route-level logic in `src/pages/`.

## Architecture
- This is a React + Vite single-page app with routing defined in [src/App.jsx](src/App.jsx).
- Shared page chrome lives in [src/components/Layout.jsx](src/components/Layout.jsx); keep new routes compatible with that wrapper.
- TMDB API access is centralized in [src/services/tmdb.js](src/services/tmdb.js); put fetch and URL-shaping changes there instead of scattering request logic across pages.
- The production and Netlify-dev backend path is [netlify/functions/tmdb-proxy.js](netlify/functions/tmdb-proxy.js), and deployment settings live in [netlify.toml](netlify.toml).
- Tailwind CSS v4 and custom fonts are configured in [src/index.css](src/index.css); preserve that setup when changing global styling.

## Build and Test
- Use `pnpm run dev` or `npm run dev` for the Netlify-aware local workflow.
- Use `pnpm run dev:vite` or `npm run dev:vite` when you only need the Vite frontend server.
- Use `pnpm run build` or `npm run build` before shipping changes.
- Use `pnpm run lint` or `npm run lint` to validate JavaScript and JSX.
- Use `pnpm run preview` or `npm run preview` to smoke-test the production build.

## Conventions
- Keep TMDB request mode switching in [src/services/tmdb.js](src/services/tmdb.js): direct TMDB calls in development when `VITE_TMDB_API_KEY` is present, otherwise the Netlify proxy.
- Keep route modules in `src/pages/` thin and prefer shared UI in `src/components/`.
- Preserve the current app shell pattern: persistent navbar/footer with route content rendered through `Outlet`.
- When changing deployment or local dev behavior, update both [netlify.toml](netlify.toml) and the relevant service code so the Vite and Netlify paths stay aligned.
- Keep the repository compatible with both pnpm and npm unless the user explicitly asks to standardize on one package manager.
- This repository is JavaScript-only; do not introduce TypeScript unless the user explicitly asks for it.
