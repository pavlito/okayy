import type { ConfirmOptions, ConfirmState as ConfirmStateType } from './types';

class Observer {
  subscribers: Array<(state: ConfirmStateType) => void>;
  state: ConfirmStateType;

  constructor() {
    this.subscribers = [];
    this.state = { isOpen: false, options: {} as ConfirmOptions, resolve: null };
  }

  // We use arrow functions to maintain the correct `this` reference
  subscribe = (subscriber: (state: ConfirmStateType) => void) => {
    this.subscribers.push(subscriber);

    return () => {
      const index = this.subscribers.indexOf(subscriber);
      this.subscribers.splice(index, 1);
    };
  };

  publish = (data: ConfirmStateType) => {
    this.subscribers.forEach((subscriber) => subscriber(data));
  };

  getSnapshot = () => {
    return this.state;
  };

  respond = (value: boolean) => {
    this.state.resolve?.(value);
    this.state = { isOpen: false, options: {} as ConfirmOptions, resolve: null };
    this.publish(this.state);
  };

  confirm = (messageOrOptions: string | ConfirmOptions): Promise<boolean> => {
    const options: ConfirmOptions =
      typeof messageOrOptions === 'string'
        ? { title: messageOrOptions }
        : messageOrOptions;

    return new Promise<boolean>((resolve) => {
      this.state = { isOpen: true, options, resolve };
      this.publish(this.state);
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
      typeof messageOrOptions === 'string'
        ? { title: messageOrOptions }
        : messageOrOptions;
    return this.confirm({ ...options, hideCancel: true });
  };

  custom = (render: (close: (value: boolean) => void) => import('react').ReactNode) => {
    return new Promise<boolean>((resolve) => {
      this.state = {
        isOpen: true,
        options: { title: '', custom: render } as ConfirmOptions,
        resolve,
      };
      this.publish(this.state);
    });
  };

  dismiss = () => {
    this.respond(false);
  };
}

export const ConfirmState = new Observer();

// bind this to the confirm function
const confirmFunction = (messageOrOptions: string | ConfirmOptions) => {
  return ConfirmState.confirm(messageOrOptions);
};

const basicConfirm = confirmFunction;

// We use `Object.assign` to maintain the correct types as we would lose them otherwise
export const confirm = Object.assign(basicConfirm, {
  danger: ConfirmState.danger,
  warning: ConfirmState.warning,
  info: ConfirmState.info,
  success: ConfirmState.success,
  alert: ConfirmState.alert,
  custom: ConfirmState.custom,
  dismiss: ConfirmState.dismiss,
});
