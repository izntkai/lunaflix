# Lunaflix Project Guidelines

## Code Style & Constraints
- **Language**: JavaScript ES modules and React function components ONLY. Do NOT introduce TypeScript.
- **Linting**: Keep changes lint-clean against [eslint.config.js](eslint.config.js) and follow the existing file-local style.
- **Git**: **NO GIT WORKTREES / COMMITS / STAGING**. Leave staging and committing to the user.
- **No Barrel Exports**: Avoid `index.js` or `index.jsx` files to keep tree-shaking efficient.
- **Output Quality**: No omissions (`// ... rest of code`) in your code examples or file diffs. Fix the root of issues, not just the symptoms.

## File Length & Modularity
- **Hard Limit**: No file should exceed 200 lines (target 100-150 lines). If a new feature pushes an edit over 200 lines, provide a split/refactor plan before writing code.
- **Component Purity**: UI components should focus strictly on rendering.
- **Hooks**: Extract complex state, side effects > 10 lines, or logic involving >2 `useState` calls into `use[Name].js` custom hooks.
- **Sub-components**: Split logical UI blocks into dedicated components if JSX in a single component exceeds 60 lines.
- **Constants**: Move large config objects or shared arrays into dedicated `.constants.js` modules.

## Architecture & Layout
- **App Shell**: This is a React + Vite single-page app with routing defined in [src/App.jsx](src/App.jsx). 
- **Layout Management**: Shared page chrome lives in [src/components/Layout.jsx](src/components/Layout.jsx). Use the global `<main>` wrapper in `App.jsx` to manage layout spacing. Never hardcode page-specific top paddings (`pt-20`, `pt-32`) to offset the fixed Navbar.
- **Directory Roles**: 
  - `src/components/`: Generic UI atoms and shared page chrome.
  - `src/pages/`: Route-level views (keep these modules thin).
  - `src/services/`: Centralized API access.
- **Styling**: Tailwind CSS v4 and custom fonts are configured in [src/index.css](src/index.css). Do not use "magic numbers" for inline styles.

## API & Data Fetching (TMDB)
- **Centralization**: TMDB API access is centralized in [src/services/tmdb.js](src/services/tmdb.js). Avoid scattering `fetch` API requests across components.
- **Native Fetch**: Never use `axios`; use the native `fetch` wrappers in `tmdb.js`.
- **Mode Switching**: Keep TMDB request mode switching in [src/services/tmdb.js](src/services/tmdb.js) (direct TMDB calls in development when `VITE_TMDB_API_KEY` is present, otherwise use the Netlify proxy).
- **Proxy/Deployment**: The production and Netlify-dev backend path is [netlify/functions/tmdb-proxy.js](netlify/functions/tmdb-proxy.js), and deployment settings live in [netlify.toml](netlify.toml). Update both files when changing dev or deployment behavior so the Vite and Netlify paths stay aligned.

## Build and Test
- **Package Manager**: The project supports both package managers, but prefer the existing package manager used by the files you see (`pnpm-lock.yaml` -> pnpm).
- Use `pnpm run dev` for the Netlify-aware local workflow.
- Use `pnpm run dev:vite` when you only need the Vite frontend server.
- Use `pnpm run build` before shipping changes.
- Use `pnpm run lint` to validate JavaScript and JSX.
- Use `pnpm run preview` to smoke-test the production build.
