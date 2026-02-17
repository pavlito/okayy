<p align="center">
  <h1 align="center">okayy</h1>
</p>

<p align="center">
  A confirm dialog for React. One line. Beautiful.
</p>

![okayy](https://github.com/user-attachments/assets/b73ce2a5-25ed-4546-8156-3b16b9e5d891)

<p align="center">
  <a href="https://www.npmjs.com/package/okayy"><img src="https://img.shields.io/npm/v/okayy.svg" alt="npm version" /></a>
  <a href="https://github.com/pavlito/okayy/actions/workflows/ci.yml"><img src="https://github.com/pavlito/okayy/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
  <a href="https://github.com/pavlito/okayy/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/okayy.svg" alt="License" /></a>
  <a href="https://bundlephobia.com/package/okayy"><img src="https://img.shields.io/bundlephobia/minzip/okayy" alt="Bundle size" /></a>
</p>

<p align="center">
  <a href="https://pavlito.github.io/okayy">Documentation</a> ·
  <a href="https://pavlito.github.io/okayy/getting-started">Getting Started</a>
</p>

## Usage

```bash
npm install okayy
```

```jsx
// app/layout.tsx
import { Confirmer } from 'okayy';
import 'okayy/styles.css';

export default function Layout({ children }) {
  return (
    <>
      {children}
      <Confirmer />
    </>
  );
}
```

```jsx
import { confirm } from 'okayy';

async function handleDelete() {
  if (await confirm('Delete this item?')) {
    // confirmed
  }
}
```

## Features

- **One function call** — `await confirm('title')` returns `true`/`false`
- **Variants** — `confirm.danger()`, `.warning()`, `.info()`, `.success()`
- **Alert mode** — `confirm.alert()` for acknowledgment dialogs
- **Async confirm** — loading spinner on the button during `onConfirm`
- **Type-to-confirm** — `confirmationKeyword` for dangerous actions
- **Custom rendering** — `confirm.custom((close) => <YourComponent />)`
- **Accessible** — focus trap, ARIA roles (`dialog`/`alertdialog`), `aria-modal`, `inert`
- **Mobile** — bottom sheet with safe-area padding
- **Themeable** — light/dark/system, CSS variables, unstyled mode
- **Tiny** — ~3.6 kB gzipped

## Documentation

Visit [pavlito.github.io/okayy](https://pavlito.github.io/okayy) for full documentation, examples, and API reference.

## Development

```bash
npm install              # Install dependencies
npm run dev:all          # Watch library + demo site
npm run test             # Unit tests (vitest)
npm run test:e2e         # E2E tests (Playwright — chromium, firefox, webkit, mobile)
npm run test:e2e:ui      # E2E tests with interactive UI
npm run build            # Build library
npm run type-check       # TypeScript check
npm run lint             # ESLint
npm run size             # Check bundle size (4.0 kB budget)
```

## License

[MIT](LICENSE)
