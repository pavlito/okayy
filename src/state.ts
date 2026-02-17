import type { ConfirmOptions, ConfirmState as ConfirmStateType } from './types';

class Observer {
  subscribers: Array<() => void>;
  state: ConfirmStateType;
  private queue: Array<{ options: ConfirmOptions; resolve: (v: boolean) => void }>;

  constructor() {
    this.subscribers = [];
    this.state = { isOpen: false, options: {} as ConfirmOptions, resolve: null };
    this.queue = [];
  }

  subscribe = (callback: () => void) => {
    this.subscribers.push(callback);
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) this.subscribers.splice(index, 1);
    };
  };

  publish = () => {
    this.subscribers.forEach((callback) => callback());
  };

  getSnapshot = () => {
    return this.state;
  };

  respond = (value: boolean) => {
    if (!this.state.isOpen) return;
    this.state.resolve?.(value);
    const next = this.queue.shift();
    if (next) {
      this.state = { isOpen: false, options: {} as ConfirmOptions, resolve: null };
      this.publish();
      queueMicrotask(() => {
        this.state = { isOpen: true, options: next.options, resolve: next.resolve };
        this.publish();
      });
    } else {
      this.state = { isOpen: false, options: {} as ConfirmOptions, resolve: null };
      this.publish();
    }
  };

  confirm = (messageOrOptions: string | ConfirmOptions): Promise<boolean> => {
    const options: ConfirmOptions =
      typeof messageOrOptions === 'string' ? { title: messageOrOptions } : messageOrOptions;

    return new Promise<boolean>((resolve) => {
      if (this.state.isOpen) {
        this.queue.push({ options, resolve });
        return;
      }
      this.state = { isOpen: true, options, resolve };
      this.publish();
    });
  };

  danger = (opts: Omit<ConfirmOptions, 'variant'>) => {
    return this.confirm({ ...opts, variant: 'danger' });
  };

  warning = (opts: Omit<ConfirmOptions, 'variant'>) => {
    return this.confirm({ ...opts, variant: 'warning' });
  };

  info = (opts: Omit<ConfirmOptions, 'variant'>) => {
    return this.confirm({ ...opts, variant: 'info' });
  };

  success = (opts: Omit<ConfirmOptions, 'variant'>) => {
    return this.confirm({ ...opts, variant: 'success' });
  };

  alert = (messageOrOptions: string | Omit<ConfirmOptions, 'hideCancel'>) => {
    const options =
      typeof messageOrOptions === 'string' ? { title: messageOrOptions } : messageOrOptions;
    return this.confirm({ ...options, hideCancel: true });
  };

  custom = (render: (close: (value: boolean) => void) => import('react').ReactNode) => {
    return this.confirm({ title: '', custom: render } as ConfirmOptions);
  };

  dismiss = () => {
    if (!this.state.isOpen) return;
    this.state = { ...this.state, dismissCount: (this.state.dismissCount || 0) + 1 };
    this.publish();
  };

  isOpen = () => {
    return this.state.isOpen;
  };

  clearQueue = () => {
    this.queue.forEach(({ resolve }) => resolve(false));
    this.queue = [];
  };
}

export const ConfirmState = new Observer();

const confirmFunction = (messageOrOptions: string | ConfirmOptions) => {
  return ConfirmState.confirm(messageOrOptions);
};

const basicConfirm = confirmFunction;

export const confirm = Object.assign(basicConfirm, {
  danger: ConfirmState.danger,
  warning: ConfirmState.warning,
  info: ConfirmState.info,
  success: ConfirmState.success,
  alert: ConfirmState.alert,
  custom: ConfirmState.custom,
  dismiss: ConfirmState.dismiss,
  isOpen: ConfirmState.isOpen,
  clearQueue: ConfirmState.clearQueue,
});
