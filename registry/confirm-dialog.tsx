"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────

export type Variant = "default" | "danger" | "warning" | "info" | "success";

export interface ConfirmOptions {
  /** Dialog title */
  title: string;
  /** Supporting description text below the title */
  description?: string;
  /** Text for the confirm button. Default: "Confirm" */
  confirmText?: string;
  /** Text for the cancel button. Default: "Cancel" */
  cancelText?: string;
  /** Visual variant controlling color scheme. Default: "default" */
  variant?: Variant;
  /** Custom icon rendered left of the title */
  icon?: ReactNode;
  /** Async action executed on confirm -- shows loading state on the button */
  onConfirm?: () => Promise<void> | void;
  /** Called when the user cancels */
  onCancel?: () => void;
  /** Whether pressing Escape or clicking the overlay dismisses. Default: true */
  dismissible?: boolean;
  /** Custom CSS class applied to the dialog content container */
  className?: string;
  /** Custom CSS class applied to the overlay */
  overlayClassName?: string;
}

export interface ConfirmerProps {
  /** Default options applied to all confirm() calls */
  defaultOptions?: Partial<ConfirmOptions>;
  /** Custom CSS class on the Confirmer wrapper */
  className?: string;
}

interface ConfirmState {
  isOpen: boolean;
  options: ConfirmOptions;
  resolve: ((value: boolean) => void) | null;
}

// ─── State (Observer Pattern) ────────────────────────────────────────────────

let state: ConfirmState = {
  isOpen: false,
  options: {} as ConfirmOptions,
  resolve: null,
};
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((fn) => fn());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): ConfirmState {
  return state;
}

function confirmFn(
  messageOrOptions: string | ConfirmOptions,
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

function respond(value: boolean) {
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
      container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
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

// ─── Variant Styles ──────────────────────────────────────────────────────────

const variantStyles: Record<
  Variant,
  {
    dialog: string;
    icon: string;
    title: string;
    description: string;
    confirm: string;
  }
> = {
  default: {
    dialog: "bg-background border-border",
    icon: "bg-muted text-foreground",
    title: "text-foreground",
    description: "text-muted-foreground",
    confirm: "",
  },
  danger: {
    dialog: "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-900",
    icon: "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400",
    title: "text-red-900 dark:text-red-300",
    description: "text-red-700 dark:text-red-400",
    confirm:
      "bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:text-white dark:hover:bg-red-700",
  },
  warning: {
    dialog:
      "bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-900",
    icon: "bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-400",
    title: "text-amber-900 dark:text-amber-300",
    description: "text-amber-700 dark:text-amber-400",
    confirm:
      "bg-amber-600 text-white hover:bg-amber-700 dark:bg-amber-600 dark:text-white dark:hover:bg-amber-700",
  },
  info: {
    dialog: "bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-900",
    icon: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400",
    title: "text-blue-900 dark:text-blue-300",
    description: "text-blue-700 dark:text-blue-400",
    confirm:
      "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700",
  },
  success: {
    dialog:
      "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-900",
    icon: "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400",
    title: "text-green-900 dark:text-green-300",
    description: "text-green-700 dark:text-green-400",
    confirm:
      "bg-green-600 text-white hover:bg-green-700 dark:bg-green-600 dark:text-white dark:hover:bg-green-700",
  },
};

// ─── Confirmer Component ─────────────────────────────────────────────────────

export function Confirmer({ defaultOptions, className }: ConfirmerProps) {
  const { isOpen, options: stateOptions } = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getSnapshot,
  );
  const options = { ...defaultOptions, ...stateOptions };

  const [visible, setVisible] = useState(false);
  const [dataState, setDataState] = useState<"open" | "closed">("closed");
  const [isLoading, setIsLoading] = useState(false);

  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const focusTrapRef = useRef<ReturnType<typeof createFocusTrap> | null>(null);

  // Open animation
  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setIsLoading(false);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setDataState("open");
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
  const handleClose = useCallback(
    (value: boolean) => {
      if (isLoading) return;
      setDataState("closed");
      const el = dialogRef.current;
      if (el) {
        const onEnd = () => {
          el.removeEventListener("transitionend", onEnd);
          setVisible(false);
          respond(value);
        };
        el.addEventListener("transitionend", onEnd);
        setTimeout(onEnd, 200);
      } else {
        setVisible(false);
        respond(value);
      }
    },
    [isLoading],
  );

  // Escape key
  useEffect(() => {
    if (!visible) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && options.dismissible !== false) {
        options.onCancel?.();
        handleClose(false);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [visible, options.dismissible, options.onCancel, handleClose]);

  const handleConfirm = async () => {
    if (isLoading) return;
    if (options.onConfirm) {
      setIsLoading(true);
      try {
        await options.onConfirm();
      } catch {
        setIsLoading(false);
        return;
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

  const variant = options.variant || "default";
  const confirmText = options.confirmText || "Confirm";
  const cancelText = options.cancelText || "Cancel";
  const styles = variantStyles[variant];

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4",
        className,
      )}
    >
      {/* Overlay */}
      <div
        data-state={dataState}
        className={cn(
          "fixed inset-0 z-50 bg-black/80 backdrop-blur-sm",
          "transition-all duration-200",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
          dataState === "open" ? "opacity-100" : "opacity-0",
          options.overlayClassName,
        )}
        onClick={handleOverlayClick}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        data-state={dataState}
        className={cn(
          "relative z-50 w-full max-w-md rounded-xl border p-6 shadow-lg",
          "transition-all duration-200",
          dataState === "open"
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-95 opacity-0 translate-y-1",
          styles.dialog,
          options.className,
        )}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="okayy-title"
        aria-describedby={options.description ? "okayy-description" : undefined}
      >
        <div className="flex flex-col">
          {/* Icon + Title */}
          <div className="flex items-start gap-3">
            {options.icon && (
              <span
                className={cn(
                  "flex shrink-0 items-center justify-center size-10 rounded-[0.625rem] [&>svg]:size-5",
                  styles.icon,
                )}
              >
                {options.icon}
              </span>
            )}
            <h2
              id="okayy-title"
              className={cn(
                "text-base font-semibold leading-6 tracking-tight",
                styles.title,
              )}
            >
              {options.title}
            </h2>
          </div>

          {/* Description */}
          {options.description && (
            <p
              id="okayy-description"
              className={cn(
                "mt-2 text-sm leading-relaxed",
                styles.description,
              )}
            >
              {options.description}
            </p>
          )}
        </div>

        {/* Actions */}
        <div
          className="mt-6 flex justify-end gap-2"
          role="group"
          aria-label="Dialog actions"
        >
          <Button
            ref={cancelRef}
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant={variant === "default" ? "default" : undefined}
            className={cn(
              "relative",
              variant !== "default" && styles.confirm,
            )}
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading && (
              <span
                className="absolute inset-0 flex items-center justify-center"
                aria-hidden="true"
              >
                <span className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
              </span>
            )}
            <span className={cn(isLoading && "invisible")}>
              {confirmText}
            </span>
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
