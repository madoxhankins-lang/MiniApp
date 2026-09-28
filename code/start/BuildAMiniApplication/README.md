# Todo Ledger

A responsive React mini-application demonstrating paginated server-state management with TanStack Query, MSW, TypeScript, Vitest, and Testing Library.

## Run locally

```bash
npm install
npm run dev
```

The app fetches six todos per page from JSONPlaceholder and caches each visited page for one minute.

## Commands

```bash
npm run build   # type-check and create a production build
npm run lint    # run ESLint
npm test        # run the MSW-backed Vitest suite
```

## Functionality

- Paginated todo data with Previous and Next controls.
- Cached pages and `keepPreviousData` keep transitions stable while the next page loads.
- Animated loading skeletons, empty-state messaging, and a retryable error state.
- MSW intercepts the JSONPlaceholder request in tests, so tests do not depend on the network.
- Tests cover loading and success rendering, page navigation/cache behavior, and recovery after an API error.

## Theming

The interface uses a paper, ink, and lime palette with Manrope for UI text and DM Mono for metadata. CSS variables keep the theme easy to adjust, while the responsive layout switches to compact stacked controls below 600px.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
