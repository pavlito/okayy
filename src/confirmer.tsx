'use client';

import React from 'react';
import ReactDOM from 'react-dom';

import { ConfirmState } from './state';
import { getAsset } from './assets';
import { createFocusTrap } from './focus-trap';
import type { ConfirmerProps } from './types';

export function Confirmer({
  theme = 'system',
  defaultOptions,
  className,
  icons,
  unstyled,
  dir,
  translations,
  spinner: globalSpinner,
}: ConfirmerProps) {
  const storeState = React.useSyncExternalStore(
    ConfirmState.subscribe,
    ConfirmState.getSnapshot,
    ConfirmState.getSnapshot,
  );

  const { isOpen, options: stateOptions } = storeState;
  const options = { ...defaultOptions, ...stateOptions };

  const [visible, setVisible] = React.useState(false);
  const [dataState, setDataState] = React.useState<'open' | 'closed' | 'initial'>('initial');
  const [isLoading, setIsLoading] = React.useState(false);
  const [resolvedTheme, setResolvedTheme] = React.useState<'light' | 'dark'>('light');
  const [confirmInput, setConfirmInput] = React.useState('');
  const [loadingAction, setLoadingAction] = React.useState<number | null>(null);

  const okayyId = React.useId();
  const titleId = `okayy-title-${okayyId}`;
  const descriptionId = `okayy-description-${okayyId}`;

  const isUnstyled = unstyled || options.unstyled;

  const dialogRef = React.useRef<HTMLDivElement>(null);
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const confirmRef = React.useRef<HTMLButtonElement>(null);
  const focusTrapRef = React.useRef<ReturnType<typeof createFocusTrap> | null>(null);
  const generationRef = React.useRef(0);
  const closeTimeoutRef = React.useRef<ReturnType<typeof setTimeout>>();
  const dismissCountRef = React.useRef(0);

  const t = translations || {};

  // Theme detection
  React.useEffect(() => {
    if (theme === 'light' || theme === 'dark') {
      setResolvedTheme(theme);
      return;
    }
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    setResolvedTheme(mq.matches ? 'dark' : 'light');
    const handler = (e: MediaQueryListEvent) => setResolvedTheme(e.matches ? 'dark' : 'light');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);

  // Open animation
  React.useEffect(() => {
    if (isOpen) {
      generationRef.current++;
      setDataState('initial');
      setVisible(true);
      setIsLoading(false);
      setConfirmInput('');
      setLoadingAction(null);
      requestAnimationFrame(() => {
        setDataState('open');
      });
    }
  }, [isOpen]);

  // Focus trap
  React.useEffect(() => {
    if (visible && dialogRef.current) {
      focusTrapRef.current = createFocusTrap(dialogRef.current);
      const initialFocus = options.hideCancel ? confirmRef.current : cancelRef.current;
      focusTrapRef.current.activate(initialFocus);
      return () => {
        focusTrapRef.current?.deactivate();
      };
    }
  }, [visible, options.hideCancel]);

  // Scroll lock
  React.useEffect(() => {
    if (!visible || typeof document === 'undefined') return;

    const body = document.body;
    const savedOverflow = body.style.overflow;
    const savedPaddingRight = body.style.paddingRight;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      body.style.overflow = savedOverflow;
      body.style.paddingRight = savedPaddingRight;
    };
  }, [visible]);

  // Close animation
  const handleClose = React.useCallback(
    (value: boolean) => {
      if (isLoading || loadingAction !== null) {
        if (!(options.cancelableWhileLoading && !value)) return;
      }
      setDataState('closed');
      const el = dialogRef.current;
      const gen = generationRef.current;
      if (el) {
        let fired = false;
        const onEnd = () => {
          if (fired || generationRef.current !== gen) return;
          fired = true;
          el.removeEventListener('animationend', onEnd);
          setVisible(false);
          try {
            options.onDismiss?.();
          } catch {
            /* swallow */
          }
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent(value ? 'okayy:confirm' : 'okayy:cancel'));
            window.dispatchEvent(new CustomEvent('okayy:close', { detail: { confirmed: value } }));
          }
          ConfirmState.respond(value);
        };
        el.addEventListener('animationend', onEnd);
        closeTimeoutRef.current = setTimeout(onEnd, 200);
      } else {
        setVisible(false);
        try {
          options.onDismiss?.();
        } catch {
          /* swallow */
        }
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent(value ? 'okayy:confirm' : 'okayy:cancel'));
          window.dispatchEvent(new CustomEvent('okayy:close', { detail: { confirmed: value } }));
        }
        ConfirmState.respond(value);
      }
    },
    [isLoading, loadingAction, options.onDismiss, options.cancelableWhileLoading],
  );

  // Dismiss effect (reacts to dismiss() calls via counter)
  React.useEffect(() => {
    const count = storeState.dismissCount || 0;
    if (count > dismissCountRef.current) {
      dismissCountRef.current = count;
      handleCancel('dismiss');
    }
  }, [storeState.dismissCount]);

  // Cleanup close timeout on unmount
  React.useEffect(
    () => () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    },
    [],
  );

  // Unmount cleanup — respond false if dialog is still open
  React.useEffect(() => {
    return () => {
      if (ConfirmState.getSnapshot().isOpen) {
        ConfirmState.respond(false);
      }
    };
  }, []);

  // Escape key
  React.useEffect(() => {
    if (!visible) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && options.dismissible !== false) {
        if (options.hideCancel) {
          handleClose(true);
        } else {
          handleCancel('escape');
        }
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [visible, options.dismissible, options.hideCancel, handleClose]);

  const handleConfirm = async () => {
    if (isLoading) return;
    if (options.onConfirm) {
      setIsLoading(true);
      try {
        const result = await options.onConfirm();
        if (result === false) {
          setIsLoading(false);
          return;
        }
      } catch {
        setIsLoading(false);
        return;
      }
      setIsLoading(false);
    }
    handleClose(true);
  };

  const handleCancel = (reason: 'button' | 'escape' | 'overlay' | 'dismiss' = 'button') => {
    if (options.hideCancel) {
      handleClose(true);
      return;
    }
    options.onCancel?.(reason);
    handleClose(false);
  };

  const handleOverlayClick = () => {
    if (options.dismissible !== false) {
      handleCancel('overlay');
    }
  };

  if (!visible) return null;

  const variant = options.variant || 'default';

  const confirmText = options.hideCancel
    ? options.confirmText || t.ok || 'OK'
    : options.confirmText || t.confirm || 'Confirm';
  const cancelText = options.cancelText || t.cancel || 'Cancel';

  // Icon resolution: false/null = hidden, undefined = use default, ReactNode = custom
  const hideIcon = options.icon === false || options.icon === null;
  const icon = hideIcon
    ? null
    : options.icon || icons?.[variant as keyof typeof icons] || getAsset(variant);
  const showIcon = !hideIcon && icon !== null && (variant !== 'default' || options.icon);

  const keywordMatch = options.confirmationKeyword
    ? confirmInput === options.confirmationKeyword
    : true;

  // Spinner resolution: options.spinner ?? globalSpinner ?? default
  const spinnerNode = (() => {
    const s = options.spinner ?? globalSpinner;
    if (s === false) return null;
    if (s) return s;
    return <span data-okayy-spinner aria-hidden="true" />;
  })();

  // RTL resolution
  const resolvedDir = (() => {
    const d = options.dir || dir;
    if (!d || d === 'auto') {
      const docDir = typeof document !== 'undefined' ? document.documentElement.dir : '';
      return docDir === 'rtl' ? 'rtl' : d === 'auto' ? undefined : undefined;
    }
    return d;
  })();

  // Keyword label resolution
  const keywordLabelNode = (() => {
    const kl = t.keywordLabel;
    if (typeof kl === 'function') return kl(options.confirmationKeyword!);
    if (typeof kl === 'string') return kl;
    return (
      <>
        Type{' '}
        <bdi>
          <strong>{options.confirmationKeyword}</strong>
        </bdi>{' '}
        to confirm
      </>
    );
  })();

  return ReactDOM.createPortal(
    <div
      data-okayy
      suppressHydrationWarning
      dir={resolvedDir || undefined}
      data-unstyled={isUnstyled || undefined}
      className={resolvedTheme === 'dark' ? 'dark' : undefined}
    >
      {/* Overlay */}
      <div
        data-okayy-overlay
        data-state={dataState}
        className={
          [options.overlayClassName, options.classNames?.overlay].filter(Boolean).join(' ') ||
          undefined
        }
        onClick={handleOverlayClick}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        data-okayy-dialog
        data-state={dataState}
        data-variant={variant}
        data-layout={options.layout || 'default'}
        data-custom={options.custom ? '' : undefined}
        data-size={options.size || undefined}
        className={
          [className, options.className, options.classNames?.dialog].filter(Boolean).join(' ') ||
          undefined
        }
        style={options.style}
        data-testid={options.testId || undefined}
        role={variant === 'danger' || variant === 'warning' ? 'alertdialog' : 'dialog'}
        aria-modal="true"
        aria-label={options.ariaLabel || undefined}
        aria-labelledby={options.ariaLabel ? undefined : titleId}
        aria-describedby={options.description ? descriptionId : undefined}
        aria-busy={isLoading || loadingAction !== null || undefined}
      >
        {options.custom ? (
          options.custom(handleClose)
        ) : (
          <>
            <div data-okayy-content className={options.classNames?.content}>
              {/* Icon + Title */}
              <div data-okayy-header>
                {showIcon && (
                  <span data-okayy-icon aria-hidden="true" className={options.classNames?.icon}>
                    {icon}
                  </span>
                )}
                <h2 id={titleId} data-okayy-title className={options.classNames?.title}>
                  {options.title}
                </h2>
              </div>

              {/* Description */}
              {options.description != null && (
                <div
                  id={descriptionId}
                  data-okayy-description
                  className={options.classNames?.description}
                >
                  {options.description}
                </div>
              )}
            </div>

            {/* Type-to-Confirm */}
            {options.confirmationKeyword && (
              <div data-okayy-keyword>
                <label data-okayy-keyword-label>{keywordLabelNode}</label>
                <input
                  data-okayy-keyword-input
                  value={confirmInput}
                  onChange={(e) => setConfirmInput(e.target.value)}
                  aria-invalid={!keywordMatch ? 'true' : undefined}
                />
              </div>
            )}

            {/* Actions */}
            <div
              data-okayy-footer
              role="group"
              aria-label={t.dialogActions || 'Dialog actions'}
              className={options.classNames?.footer}
            >
              {!options.hideCancel && (
                <button
                  ref={cancelRef}
                  data-okayy-button
                  data-okayy-cancel
                  data-testid={options.testId ? `${options.testId}-cancel` : undefined}
                  className={options.classNames?.cancelButton}
                  onClick={() => handleCancel('button')}
                  disabled={
                    options.cancelableWhileLoading ? false : isLoading || loadingAction !== null
                  }
                >
                  {cancelText}
                </button>
              )}
              {options.actions?.map((action, i) => (
                <button
                  key={i}
                  data-okayy-button
                  data-okayy-action
                  className={options.classNames?.actionButton}
                  onClick={async () => {
                    setLoadingAction(i);
                    try {
                      await action.onClick();
                    } catch {
                      setLoadingAction(null);
                      return;
                    }
                    setLoadingAction(null);
                    handleClose(false);
                  }}
                  disabled={isLoading || loadingAction !== null}
                >
                  {loadingAction === i && spinnerNode}
                  <span style={loadingAction === i ? { visibility: 'hidden' } : undefined}>
                    {action.label}
                  </span>
                </button>
              ))}
              <button
                ref={confirmRef}
                data-okayy-button
                data-okayy-confirm
                data-testid={options.testId ? `${options.testId}-confirm` : undefined}
                data-variant={variant}
                className={options.classNames?.confirmButton}
                onClick={handleConfirm}
                disabled={isLoading || loadingAction !== null || !keywordMatch}
              >
                {isLoading && spinnerNode}
                <span style={isLoading ? { visibility: 'hidden' } : undefined}>{confirmText}</span>
              </button>
            </div>

            {/* Screen reader loading announcement */}
            {(isLoading || loadingAction !== null) && (
              <span role="status" data-okayy-sr-only>
                {t.loading || 'Loading...'}
              </span>
            )}
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}
