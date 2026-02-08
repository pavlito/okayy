"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

// ─── Types ───────────────────────────────────────────────────────────────────

export type Variant = "default" | "danger" | "warning" | "info" | "success";

export interface ConfirmOptions {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: Variant;
  icon?: ReactNode;
  onConfirm?: () => Promise<void> | void;
  onCancel?: () => void;
  dismissible?: boolean;
  className?: string;
  overlayClassName?: string;
}

export interface ConfirmerProps {
  theme?: "light" | "dark" | "system";
  defaultOptions?: Partial<ConfirmOptions>;
  className?: string;
}

interface ConfirmState {
  isOpen: boolean;
  options: ConfirmOptions;
  resolve: ((value: boolean) => void) | null;
}

// ─── State ───────────────────────────────────────────────────────────────────

let state: ConfirmState = {
  isOpen: false,
  options: {} as ConfirmOptions,
  resolve: null,
};
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

function confirmFn(
  messageOrOptions: string | ConfirmOptions
): Promise<boolean> {
  const options: ConfirmOptions =
    typeof messageOrOptions === "string"
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
  danger: (options: Omit<ConfirmOptions, "variant">) => Promise<boolean>;
  warning: (options: Omit<ConfirmOptions, "variant">) => Promise<boolean>;
  info: (options: Omit<ConfirmOptions, "variant">) => Promise<boolean>;
  success: (options: Omit<ConfirmOptions, "variant">) => Promise<boolean>;
};

export const confirm = confirmFn as ConfirmFn;

confirm.danger = (opts) => confirmFn({ ...opts, variant: "danger" });
confirm.warning = (opts) => confirmFn({ ...opts, variant: "warning" });
confirm.info = (opts) => confirmFn({ ...opts, variant: "info" });
confirm.success = (opts) => confirmFn({ ...opts, variant: "success" });

// ─── Focus Trap ──────────────────────────────────────────────────────────────

const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

function createFocusTrap(container: HTMLElement) {
  let previouslyFocused: HTMLElement | null = null;

  function getFocusableElements() {
    return Array.from(
      container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
    ).filter((el) => !el.hasAttribute("disabled"));
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key !== "Tab") return;

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
    const siblings = document.body.children;
    for (let i = 0; i < siblings.length; i++) {
      const el = siblings[i] as HTMLElement;
      if (!container.contains(el) && el !== container.parentElement) {
        if (value) {
          el.setAttribute("inert", "");
        } else {
          el.removeAttribute("inert");
        }
      }
    }
  }

  function activate(initialFocusRef?: HTMLElement | null) {
    previouslyFocused = document.activeElement as HTMLElement;
    setInert(true);
    document.addEventListener("keydown", handleKeyDown);

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
    setInert(false);
    document.removeEventListener("keydown", handleKeyDown);
    previouslyFocused?.focus();
  }

  return { activate, deactivate };
}

// ─── Confirmer Component ─────────────────────────────────────────────────────

const DEFAULT_OPTIONS: ConfirmOptions = { title: "" };

export function Confirmer({
  theme = "system",
  defaultOptions,
  className,
}: ConfirmerProps) {
  const [dialogState, setDialogState] = useState<ConfirmState>({
    isOpen: false,
    options: DEFAULT_OPTIONS,
    resolve: null,
  });
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const trapRef = useRef<ReturnType<typeof createFocusTrap> | null>(null);

  const titleId = useId();
  const descId = useId();

  // Subscribe to global state
  useEffect(() => {
    return subscribe(() => {
      const snap = getSnapshot();
      if (snap.isOpen) {
        setDialogState(snap);
      } else {
        setVisible(false);
        const timeout = setTimeout(() => {
          setDialogState(snap);
          setLoading(false);
        }, 150);
        return () => clearTimeout(timeout);
      }
    });
  }, []);

  const mergedOptions = { ...defaultOptions, ...dialogState.options };
  const {
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "default",
    icon,
    onConfirm,
    onCancel,
    dismissible = true,
    className: dialogClassName,
    overlayClassName,
  } = mergedOptions;

  // Manage visibility for animations
  useEffect(() => {
    if (dialogState.isOpen) {
      setVisible(true);
    }
  }, [dialogState.isOpen]);

  // Focus trap
  useEffect(() => {
    if (!visible || !overlayRef.current) return;

    const trap = createFocusTrap(overlayRef.current);
    trapRef.current = trap;
    trap.activate(cancelRef.current);

    return () => {
      trap.deactivate();
      trapRef.current = null;
    };
  }, [visible]);

  const close = useCallback(
    (result: boolean) => {
      respond(result);
    },
    []
  );

  const handleConfirm = useCallback(async () => {
    if (loading) return;

    if (onConfirm) {
      setLoading(true);
      try {
        await onConfirm();
      } catch {
        setLoading(false);
        return;
      }
    }
    close(true);
  }, [loading, onConfirm, close]);

  const handleCancel = useCallback(() => {
    if (loading) return;
    onCancel?.();
    close(false);
  }, [loading, onCancel, close]);

  // Escape key
  useEffect(() => {
    if (!dialogState.isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && dismissible && !loading) {
        handleCancel();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [dialogState.isOpen, dismissible, loading, handleCancel]);

  // Overlay click
  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === overlayRef.current && dismissible && !loading) {
        handleCancel();
      }
    },
    [dismissible, loading, handleCancel]
  );

  if (!dialogState.isOpen && !visible) return null;

  const resolvedTheme =
    theme === "system"
      ? typeof window !== "undefined" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme;

  const dataState = visible && dialogState.isOpen ? "open" : "closed";

  return createPortal(
    <>
      <div
        data-affirm-overlay=""
        data-state={dataState}
        className={overlayClassName}
        onClick={handleOverlayClick}
        ref={overlayRef}
      />
      <div
        data-affirm=""
        data-variant={variant}
        className={[resolvedTheme === "dark" ? "dark" : "", className]
          .filter(Boolean)
          .join(" ")}
      >
        <div
          ref={dialogRef}
          role="alertdialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={description ? descId : undefined}
          data-affirm-dialog=""
          data-state={dataState}
          className={dialogClassName}
        >
          <div data-affirm-content="">
            <div data-affirm-header="">
              {icon && <span data-affirm-icon="">{icon}</span>}
              <h2 id={titleId} data-affirm-title="">
                {title}
              </h2>
            </div>

            {description && (
              <p id={descId} data-affirm-description="">
                {description}
              </p>
            )}

            <div data-affirm-footer="">
              <button
                ref={cancelRef}
                type="button"
                data-affirm-button=""
                data-affirm-cancel=""
                onClick={handleCancel}
                disabled={loading}
              >
                {cancelText}
              </button>
              <button
                type="button"
                data-affirm-button=""
                data-affirm-confirm=""
                onClick={handleConfirm}
                disabled={loading}
              >
                {loading && <span data-affirm-spinner="" aria-hidden="true" />}
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
