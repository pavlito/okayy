import type { ReactNode, CSSProperties } from 'react';

export type Variant = 'default' | 'danger' | 'warning' | 'info' | 'success';

export interface ConfirmIcons {
  danger?: ReactNode;
  warning?: ReactNode;
  info?: ReactNode;
  success?: ReactNode;
}

export interface ConfirmClassNames {
  dialog?: string;
  overlay?: string;
  title?: string;
  description?: string;
  confirmButton?: string;
  cancelButton?: string;
  actionButton?: string;
  icon?: string;
  content?: string;
  footer?: string;
}

export interface ConfirmAction {
  /** Button label */
  label: string;
  /** Click handler — can return a Promise for loading state */
  onClick: () => void | Promise<void>;
}

export interface ConfirmTranslations {
  confirm?: string;
  cancel?: string;
  ok?: string;
  keywordLabel?: string | ((keyword: string) => ReactNode);
  dialogActions?: string;
  loading?: string;
}

export interface ConfirmOptions {
  /** Dialog title — the primary question or statement */
  title: string;
  /** Supporting content below the title — can be a string or React element */
  description?: ReactNode;
  /** Text for the confirm button. Default: "Confirm" */
  confirmText?: string;
  /** Text for the cancel button. Default: "Cancel" */
  cancelText?: string;
  /** Visual variant controlling color scheme. Default: "default" */
  variant?: Variant;
  /** Custom icon rendered left of the title. Set to `false` or `null` to hide. */
  icon?: ReactNode | false;
  /** Async action executed on confirm — shows loading state on the button. Return `false` to keep dialog open. */
  onConfirm?: () => Promise<void | false> | void | false;
  /** Called when the user cancels with a reason for the cancellation */
  onCancel?: (reason?: 'button' | 'escape' | 'overlay' | 'dismiss') => void;
  /** Called when the dialog is dismissed by any means (confirm, cancel, Escape, overlay click) */
  onDismiss?: () => void;
  /** Whether pressing Escape or clicking the overlay dismisses. Default: true */
  dismissible?: boolean;
  /** Custom accessible label for the dialog. Overrides the auto-generated labelledby. Useful for i18n. */
  ariaLabel?: string;
  /** Custom CSS class applied to the dialog content container */
  className?: string;
  /** Custom CSS class applied to the overlay */
  overlayClassName?: string;
  /** Hide the cancel button (used by confirm.alert()). Default: false */
  hideCancel?: boolean;
  /** Require the user to type this keyword to enable the confirm button */
  confirmationKeyword?: string;
  /** Dialog layout. Default: "default" */
  layout?: 'default' | 'centered';
  /** Additional action buttons rendered between cancel and confirm */
  actions?: ConfirmAction[];
  /** Per-element CSS classes for granular styling (Tailwind-friendly) */
  classNames?: ConfirmClassNames;
  /** Strip default styles for this dialog. Use with classNames. */
  unstyled?: boolean;
  /** Inline CSS styles applied to the dialog container */
  style?: CSSProperties;
  /** Test ID prefix applied as data-testid for E2E testing. Sets data-testid on dialog, confirm button, and cancel button. */
  testId?: string;
  /** Render a fully custom dialog body. Receives a close function. */
  custom?: (close: (value: boolean) => void) => ReactNode;
  /** Whether the cancel button is clickable while loading. Default: false */
  cancelableWhileLoading?: boolean;
  /** Custom spinner element. Set to `false` to hide spinner (buttons still disabled). */
  spinner?: ReactNode | false;
  /** Dialog size preset. Default: "md" */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Text direction override for this dialog */
  dir?: 'ltr' | 'rtl' | 'auto';
}

export interface ConfirmerProps {
  /** Theme mode. Default: 'system' */
  theme?: 'light' | 'dark' | 'system';
  /** Default options applied to all confirm() calls */
  defaultOptions?: Partial<ConfirmOptions>;
  /** Custom CSS class on the Confirmer wrapper */
  className?: string;
  /** Default icons per variant */
  icons?: ConfirmIcons;
  /** Strip all default styles. Use with classNames for full Tailwind control. Default: false */
  unstyled?: boolean;
  /** Text direction for RTL language support */
  dir?: 'ltr' | 'rtl' | 'auto';
  /** Translation overrides for all dialogs */
  translations?: ConfirmTranslations;
  /** Custom spinner element for all dialogs. Set to `false` to hide spinner globally. */
  spinner?: ReactNode | false;
}

export interface ConfirmState {
  isOpen: boolean;
  options: ConfirmOptions;
  resolve: ((value: boolean) => void) | null;
  dismissCount?: number;
}
