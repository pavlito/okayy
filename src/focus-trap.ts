const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export function createFocusTrap(container: HTMLElement) {
  let previouslyFocused: HTMLElement | null = null;

  function getFocusableElements() {
    return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
      (el) => !el.hasAttribute('disabled'),
    );
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key !== 'Tab') return;

    const focusable = getFocusableElements();
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  function setInert(value: boolean) {
    if (typeof document === 'undefined') return;
    const siblings = Array.from(document.body.children);
    for (const el of siblings) {
      if (el instanceof HTMLElement && !container.contains(el) && el !== container.parentElement) {
        if (value) {
          if (!el.hasAttribute('data-okayy')) el.setAttribute('inert', '');
        } else {
          el.removeAttribute('inert');
        }
      }
    }
  }

  function activate(initialFocusRef?: HTMLElement | null) {
    if (typeof document === 'undefined') return;
    previouslyFocused = document.activeElement as HTMLElement;
    setInert(true);
    document.addEventListener('keydown', handleKeyDown);

    // Focus initial element (cancel button) on next frame
    requestAnimationFrame(() => {
      if (initialFocusRef) {
        initialFocusRef.focus();
      } else {
        const focusable = getFocusableElements();
        if (focusable.length > 0) {
          focusable[0].focus();
        }
      }
    });
  }

  function deactivate() {
    if (typeof document === 'undefined') return;
    setInert(false);
    document.removeEventListener('keydown', handleKeyDown);
    previouslyFocused?.focus();
  }

  return { activate, deactivate };
}
