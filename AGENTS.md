<!-- BEGIN:Vite-React-agent-rules -->
# Vite + React (JavaScript)

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:Vite-React-agent-rules -->


This project supports both pnpm and npm. Prefer the existing package manager used by the files you see (pnpm-lock.yaml / package-lock.json).

Your skills are located at .instructions/skills. Review them first

##  📜 Golden Rules (Hard Constraints)
0. **NO GIT WORKTREES / COMMITS / STAGING**: Never create/use git worktrees (`git worktree`). Never perform git commits, pushes, or stage changes (`git add`). Execute all changes directly in the active branch and leave the staging/committing to the user.
1. **Fix the Root, Not the Symptom:** If an error occurs, refactor the logic; do not suppress it. (Note: This is a JS-only project; do not introduce TypeScript).
2. **JIT Context:** Before editing, run `ls` on the directory to ensure you understand the surrounding file structure.
3. **Small Diffs:** Break large tasks into multiple steps. Provide a plan before writing >50 lines of code.
4. **No Barrel Exports:** Avoid `index.ts` files to keep tree-shaking efficient.
5. **Don't Be Helpful, Be Better:** If a task is ambiguous, ask for clarification instead of guessing and writing 100 lines of wrong code.
6. **Prefer Layout Composition:** Never hardcode page-specific top paddings (`pt-20`, `pt-32`) to offset the fixed Navbar. Use the global `<main>` wrapper in `App.jsx` to manage layout spacing.

## 🚫 Anti-Patterns to Avoid
- Keep TMDB request mode switching in `src/services/tmdb.js`. Avoid scattering `fetch` across components.
- Never use `axios`; use the native `fetch` wrappers centralized in `src/services/tmdb.js`.
- Avoid "magic numbers"; handle global styling in `src/index.css` via Tailwind v4.

## 🏗 Directory Navigation
- `/src/components`: Generic UI atoms and shared page chrome.
- `/src/pages`: Route-level views.
- `/src/services`: Centralized API access (e.g., TMDB API).

## Golden Rules

1. Hard Limit
- No file should exceed 200 lines.

2. Pre-Task Check
- Before implementing any new feature, check the current size of each target file.
- If the edit would push a file over 200 lines, propose a split/refactor plan before writing code.

3. Component Purity
- UI components should focus on rendering.
- Complex state, side effects, and orchestration logic must be extracted into custom hooks (`use[Name].ts`).

## File Length & Modularity Standards

### 1. Target Size
- Optimal target: 100-150 lines per file.
- Warning threshold: above 150 lines, plan a split soon.
- Hard ceiling: 200 lines, no exceptions for new work.

### 2. Strategic Splitting Rules
- Hooks: Extract any logic involving more than two `useState` calls or any `useEffect` longer than 10 lines into a custom `use[Name].js` hook.
- Sub-components: If JSX in a component exceeds 60 lines, split logical UI blocks into dedicated components.
- Constants: Move large config objects or shared arrays into dedicated `.constants.js` modules (No TS types needed).

### 3. Output Quality Rules
- No omissions: Never use placeholders such as `// ... rest of code` or `/* existing code */` when providing file edits.
- Refactor-first mindset: If a target file is already near the hard limit, split first, then implement.

