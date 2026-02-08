import type { ConfirmOptions, ConfirmState } from './types';

let state: ConfirmState = { isOpen: false, options: {} as ConfirmOptions, resolve: null };
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((fn) => fn());
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getSnapshot(): ConfirmState {
  return state;
}

function confirmFn(messageOrOptions: string | ConfirmOptions): Promise<boolean> {
  const options: ConfirmOptions =
    typeof messageOrOptions === 'string'
      ? { title: messageOrOptions }
      : messageOrOptions;

  return new Promise<boolean>((resolve) => {
    state = { isOpen: true, options, resolve };
    emit();
  });
}

export function respond(value: boolean) {
  state.resolve?.(value);
  state = { isOpen: false, options: {} as ConfirmOptions, resolve: null };
  emit();
}

type ConfirmFn = {
  (message: string): Promise<boolean>;
  (options: ConfirmOptions): Promise<boolean>;
  danger: (options: Omit<ConfirmOptions, 'variant'>) => Promise<boolean>;
  warning: (options: Omit<ConfirmOptions, 'variant'>) => Promise<boolean>;
  info: (options: Omit<ConfirmOptions, 'variant'>) => Promise<boolean>;
  success: (options: Omit<ConfirmOptions, 'variant'>) => Promise<boolean>;
};

export const confirm = confirmFn as ConfirmFn;

confirm.danger = (opts) => confirmFn({ ...opts, variant: 'danger' });
confirm.warning = (opts) => confirmFn({ ...opts, variant: 'warning' });
confirm.info = (opts) => confirmFn({ ...opts, variant: 'info' });
confirm.success = (opts) => confirmFn({ ...opts, variant: 'success' });
