import { useSyncExternalStore, useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { subscribe, getSnapshot, respond } from './state';
import { createFocusTrap } from './focus-trap';
import type { ConfirmerProps } from './types';

export function Confirmer({ theme = 'system', defaultOptions, className }: ConfirmerProps) {
  const { isOpen, options: stateOptions } = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const options = { ...defaultOptions, ...stateOptions };

  const [visible, setVisible] = useState(false);
  const [dataState, setDataState] = useState<'open' | 'closed'>('closed');
  const [isLoading, setIsLoading] = useState(false);
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const focusTrapRef = useRef<ReturnType<typeof createFocusTrap> | null>(null);

  // Theme detection
  useEffect(() => {
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
  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setIsLoading(false);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setDataState('open');
        });
      });
    }
  }, [isOpen]);

  // Focus trap
  useEffect(() => {
    if (visible && dialogRef.current) {
      focusTrapRef.current = createFocusTrap(dialogRef.current);
      focusTrapRef.current.activate(cancelRef.current);
      return () => {
        focusTrapRef.current?.deactivate();
      };
    }
  }, [visible]);

  // Close animation
  const handleClose = useCallback((value: boolean) => {
    if (isLoading) return;
    setDataState('closed');
    const el = dialogRef.current;
    if (el) {
      const onEnd = () => {
        el.removeEventListener('transitionend', onEnd);
        setVisible(false);
        respond(value);
      };
      el.addEventListener('transitionend', onEnd);
      // Fallback if transitionend doesn't fire
      setTimeout(onEnd, 200);
    } else {
      setVisible(false);
      respond(value);
    }
  }, [isLoading]);

  // Escape key
  useEffect(() => {
    if (!visible) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && options.dismissible !== false) {
        options.onCancel?.();
        handleClose(false);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [visible, options.dismissible, options.onCancel, handleClose]);

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
  const confirmText = options.confirmText || 'Confirm';
  const cancelText = options.cancelText || 'Cancel';

  return createPortal(
    <div
      data-affirm
      className={resolvedTheme === 'dark' ? 'dark' : undefined}
    >
      {/* Overlay */}
      <div
        data-affirm-overlay
        data-state={dataState}
        className={options.overlayClassName}
        onClick={handleOverlayClick}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        data-affirm-dialog
        data-state={dataState}
        data-variant={variant}
        className={[className, options.className].filter(Boolean).join(' ') || undefined}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="affirm-title"
        aria-describedby={options.description ? 'affirm-description' : undefined}
      >
        <div data-affirm-content>
          {/* Icon + Title */}
          <div data-affirm-header>
            {options.icon && <span data-affirm-icon>{options.icon}</span>}
            <h2 id="affirm-title" data-affirm-title>
              {options.title}
            </h2>
          </div>

          {/* Description */}
          {options.description && (
            <p id="affirm-description" data-affirm-description>
              {options.description}
            </p>
          )}
        </div>

        {/* Actions */}
        <div data-affirm-footer role="group" aria-label="Dialog actions">
          <button
            ref={cancelRef}
            data-affirm-button
            data-affirm-cancel
            onClick={handleCancel}
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            data-affirm-button
            data-affirm-confirm
            data-variant={variant}
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading && <span data-affirm-spinner aria-hidden="true" />}
            <span style={isLoading ? { visibility: 'hidden' } : undefined}>
              {confirmText}
            </span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
