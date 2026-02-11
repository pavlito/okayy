<p align="center">
  <h1 align="center">affirm</h1>
</p>

<p align="center">
  A confirm dialog for React. One line. Beautiful.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/affirm"><img src="https://img.shields.io/npm/v/affirm.svg" alt="npm version" /></a>
  <a href="https://github.com/pavlito/affirm/actions/workflows/ci.yml"><img src="https://github.com/pavlito/affirm/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
  <a href="https://github.com/pavlito/affirm/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/affirm.svg" alt="License" /></a>
  <a href="https://img.shields.io/bundlephobia/minzip/affirm"><img src="https://img.shields.io/bundlephobia/minzip/affirm" alt="Bundle size" /></a>
</p>

<p align="center">
  <a href="https://pavlito.github.io/affirm">Documentation</a> ·
  <a href="https://pavlito.github.io/affirm/getting-started">Getting Started</a>
</p>

---

## Usage

```bash
npm install affirm
```

```jsx
// app/layout.tsx
import { Confirmer } from 'affirm';
import 'affirm/styles.css';

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
import { confirm } from 'affirm';

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
- **Accessible** — focus trap, `role="alertdialog"`, `aria-modal`, `inert`
- **Mobile** — bottom sheet with drag handle and safe-area padding
- **Themeable** — light/dark/system, CSS variables, unstyled mode
- **Tiny** — ~3 kB gzipped

## Documentation

Visit [pavlito.github.io/affirm](https://pavlito.github.io/affirm) for full documentation, examples, and API reference.

## License

[MIT](LICENSE)
