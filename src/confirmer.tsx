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
}: ConfirmerProps) {
  const [storeState, setStoreState] = React.useState(ConfirmState.getSnapshot());

  React.useEffect(() => {
    return ConfirmState.subscribe((newState) => {
      // Prevent batching, temp solution.
      setTimeout(() => {
        ReactDOM.flushSync(() => {
          setStoreState(newState);
        });
      });
    });
  }, []);

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
      setVisible(true);
      setIsLoading(false);
      setConfirmInput('');
      setLoadingAction(null);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setDataState('open');
        });
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
  }, [visible]);

  // Close animation
  const handleClose = React.useCallback(
    (value: boolean) => {
      if (isLoading || loadingAction !== null) return;
      setDataState('closed');
      const el = dialogRef.current;
      if (el) {
        let fired = false;
        const onEnd = () => {
          if (fired) return;
          fired = true;
          el.removeEventListener('animationend', onEnd);
          setVisible(false);
          options.onDismiss?.();
          ConfirmState.respond(value);
        };
        el.addEventListener('animationend', onEnd);
        // Fallback if animationend doesn't fire
        setTimeout(onEnd, 200);
      } else {
        setVisible(false);
        options.onDismiss?.();
        ConfirmState.respond(value);
      }
    },
    [isLoading, loadingAction, options.onDismiss],
  );

  // Escape key
  React.useEffect(() => {
    if (!visible) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && options.dismissible !== false) {
        if (options.hideCancel) {
          handleClose(true);
        } else {
          options.onCancel?.();
          handleClose(false);
        }
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [visible, options.dismissible, options.onCancel, options.hideCancel, handleClose]);

  const handleConfirm = async () => {
    if (isLoading) return;
    if (options.onConfirm) {
      setIsLoading(true);
      try {
        await options.onConfirm();
      } finally {
        setIsLoading(false);
      }
    }
    handleClose(true);
  };

  const handleCancel = () => {
    if (options.hideCancel) {
      handleClose(true);
      return;
    }
    options.onCancel?.();
    handleClose(false);
  };

  const handleOverlayClick = () => {
    if (options.dismissible !== false) {
      handleCancel();
    }
  };

  if (!visible) return null;

  const variant = options.variant || 'default';
  const confirmText = options.hideCancel
    ? options.confirmText || 'OK'
    : options.confirmText || 'Confirm';
  const cancelText = options.cancelText || 'Cancel';

  // Icon resolution: false/null = hidden, undefined = use default, ReactNode = custom
  const hideIcon = options.icon === false || options.icon === null;
  const icon = hideIcon
    ? null
    : options.icon || icons?.[variant as keyof typeof icons] || getAsset(variant);
  const showIcon = !hideIcon && icon !== null && (variant !== 'default' || options.icon);

  const keywordMatch = options.confirmationKeyword
    ? confirmInput === options.confirmationKeyword
    : true;

  return ReactDOM.createPortal(
    <div
      data-okayy
      suppressHydrationWarning
      dir={dir || undefined}
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
        className={
          [className, options.className, options.classNames?.dialog].filter(Boolean).join(' ') ||
          undefined
        }
        style={options.style}
        data-testid={options.testId || undefined}
        role="alertdialog"
        aria-modal="true"
        aria-label={options.ariaLabel || undefined}
        aria-labelledby={options.ariaLabel ? undefined : titleId}
        aria-describedby={options.description ? descriptionId : undefined}
      >
        {options.custom ? (
          options.custom(handleClose)
        ) : (
          <>
            <div data-okayy-content className={options.classNames?.content}>
              {/* Icon + Title */}
              <div data-okayy-header>
                {showIcon && (
                  <span data-okayy-icon className={options.classNames?.icon}>
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
                <label data-okayy-keyword-label>
                  Type <strong>{options.confirmationKeyword}</strong> to confirm
                </label>
                <input
                  data-okayy-keyword-input
                  value={confirmInput}
                  onChange={(e) => setConfirmInput(e.target.value)}
                />
              </div>
            )}

            {/* Actions */}
            <div
              data-okayy-footer
              role="group"
              aria-label="Dialog actions"
              className={options.classNames?.footer}
            >
              {!options.hideCancel && (
                <button
                  ref={cancelRef}
                  data-okayy-button
                  data-okayy-cancel
                  data-testid={options.testId ? `${options.testId}-cancel` : undefined}
                  className={options.classNames?.cancelButton}
                  onClick={handleCancel}
                  disabled={isLoading || loadingAction !== null}
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
                    } finally {
                      setLoadingAction(null);
                    }
                    handleClose(false);
                  }}
                  disabled={isLoading || loadingAction !== null}
                >
                  {loadingAction === i && <span data-okayy-spinner aria-hidden="true" />}
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
                {isLoading && <span data-okayy-spinner aria-hidden="true" />}
                <span style={isLoading ? { visibility: 'hidden' } : undefined}>{confirmText}</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}
