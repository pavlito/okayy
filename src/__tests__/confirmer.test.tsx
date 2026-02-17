import { describe, it, expect, afterEach, beforeAll, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, cleanup, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Confirmer } from '../confirmer';
import { ConfirmState, confirm } from '../state';

// jsdom does not implement window.matchMedia, stub it for theme detection
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
});

// Helper to open a dialog and wait for it to render
async function openDialog(options: Parameters<typeof ConfirmState.confirm>[0] = 'Are you sure?') {
  ConfirmState.confirm(options);
  await waitFor(() => {
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
}

// Helper for danger/warning dialogs that use alertdialog role
async function openAlertDialog(options: Parameters<typeof ConfirmState.confirm>[0]) {
  ConfirmState.confirm(options);
  await waitFor(() => {
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
  });
}

describe('Confirmer', () => {
  beforeEach(() => {
    confirm.clearQueue();
  });

  afterEach(() => {
    cleanup();
    if (ConfirmState.getSnapshot().isOpen) {
      ConfirmState.respond(false);
    }
    confirm.clearQueue();
    document.body.querySelectorAll('[data-okayy]').forEach((el) => el.remove());
  });

  it('renders nothing when no dialog is open', () => {
    render(<Confirmer />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders the dialog when confirm() is called', async () => {
    render(<Confirmer />);
    await openDialog();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('displays the title text', async () => {
    render(<Confirmer />);
    await openDialog('Delete this item?');
    expect(screen.getByText('Delete this item?')).toBeInTheDocument();
  });

  it('displays description when provided', async () => {
    render(<Confirmer />);
    await openDialog({ title: 'Delete?', description: 'This cannot be undone.' });
    expect(screen.getByText('This cannot be undone.')).toBeInTheDocument();
  });

  it('has aria-modal attribute', async () => {
    render(<Confirmer />);
    await openDialog();
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  });

  it('shows default button text (Confirm / Cancel)', async () => {
    render(<Confirmer />);
    await openDialog();
    expect(screen.getByText('Confirm')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('shows custom button text', async () => {
    render(<Confirmer />);
    await openDialog({ title: 'Delete?', confirmText: 'Yes, delete', cancelText: 'No, keep it' });
    expect(screen.getByText('Yes, delete')).toBeInTheDocument();
    expect(screen.getByText('No, keep it')).toBeInTheDocument();
  });

  it('hides cancel button in alert mode', async () => {
    render(<Confirmer />);
    ConfirmState.alert('Notice');
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
    expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
  });

  it('sets data-variant attribute', async () => {
    render(<Confirmer />);
    await openAlertDialog({ title: 'Danger!', variant: 'danger' });
    const dialog = screen.getByRole('alertdialog');
    expect(dialog).toHaveAttribute('data-variant', 'danger');
  });

  it('uses role="alertdialog" for danger variant', async () => {
    render(<Confirmer />);
    await openAlertDialog({ title: 'Danger!', variant: 'danger' });
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
  });

  it('uses role="alertdialog" for warning variant', async () => {
    render(<Confirmer />);
    await openAlertDialog({ title: 'Warning!', variant: 'warning' });
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
  });

  it('uses role="dialog" for default/info/success variants', async () => {
    render(<Confirmer />);
    await openDialog({ title: 'Info', variant: 'info' });
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('resolves with true when Confirm button is clicked', async () => {
    render(<Confirmer />);
    const promise = ConfirmState.confirm('Delete?');
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const confirmBtn = screen.getByText('Confirm');
    await userEvent.click(confirmBtn);

    const result = await waitFor(() => promise, { timeout: 500 });
    expect(result).toBe(true);
  });

  it('resolves with false when Cancel button is clicked', async () => {
    render(<Confirmer />);
    const promise = ConfirmState.confirm('Delete?');
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const cancelBtn = screen.getByText('Cancel');
    await userEvent.click(cancelBtn);

    const result = await waitFor(() => promise, { timeout: 500 });
    expect(result).toBe(false);
  });

  it('resolves with false when Escape key is pressed', async () => {
    render(<Confirmer />);
    const promise = ConfirmState.confirm('Delete?');
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    await userEvent.keyboard('{Escape}');

    const result = await waitFor(() => promise, { timeout: 500 });
    expect(result).toBe(false);
  });

  it('does not dismiss on Escape when dismissible is false', async () => {
    render(<Confirmer />);
    ConfirmState.confirm({ title: 'Delete?', dismissible: false });
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    await userEvent.keyboard('{Escape}');

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('applies data-testid when testId option is set', async () => {
    render(<Confirmer />);
    await openDialog({ title: 'Test', testId: 'my-dialog' });
    expect(document.querySelector('[data-testid="my-dialog"]')).toBeInTheDocument();
    expect(document.querySelector('[data-testid="my-dialog-confirm"]')).toBeInTheDocument();
    expect(document.querySelector('[data-testid="my-dialog-cancel"]')).toBeInTheDocument();
  });

  it('uses custom ariaLabel on the dialog', async () => {
    render(<Confirmer />);
    await openDialog({ title: 'Test', ariaLabel: 'Custom label' });
    const dialog = document.querySelector('[data-okayy-dialog]');
    expect(dialog).toHaveAttribute('aria-label', 'Custom label');
    expect(dialog).not.toHaveAttribute('aria-labelledby');
  });

  it('calls onDismiss when confirmed', async () => {
    const onDismiss = vi.fn();
    render(<Confirmer />);
    const promise = ConfirmState.confirm({ title: 'Delete?', onDismiss });
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const confirmBtn = screen.getByText('Confirm');
    await userEvent.click(confirmBtn);

    await waitFor(() => expect(onDismiss).toHaveBeenCalledTimes(1), { timeout: 500 });
    await promise;
  });

  it('calls onDismiss when cancelled', async () => {
    const onDismiss = vi.fn();
    render(<Confirmer />);
    const promise = ConfirmState.confirm({ title: 'Delete?', onDismiss });
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const cancelBtn = screen.getByText('Cancel');
    await userEvent.click(cancelBtn);

    await waitFor(() => expect(onDismiss).toHaveBeenCalledTimes(1), { timeout: 500 });
    await promise;
  });

  it('calls onDismiss when Escape pressed', async () => {
    const onDismiss = vi.fn();
    render(<Confirmer />);
    const promise = ConfirmState.confirm({ title: 'Delete?', onDismiss });
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    await userEvent.keyboard('{Escape}');

    await waitFor(() => expect(onDismiss).toHaveBeenCalledTimes(1), { timeout: 500 });
    await promise;
  });

  it('disables confirm button until confirmationKeyword is typed', async () => {
    render(<Confirmer />);
    await openDialog({ title: 'Delete?', confirmationKeyword: 'DELETE' });

    const confirmBtn = screen.getByText('Confirm').closest('button')!;
    expect(confirmBtn).toBeDisabled();

    const input = document.querySelector('[data-okayy-keyword-input]') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'DELETE' } });

    await waitFor(
      () => {
        expect(confirmBtn).not.toBeDisabled();
      },
      { timeout: 500 },
    );
  });

  // --- New tests for v0.1.0 features ---

  it('onConfirm error keeps dialog open', async () => {
    render(<Confirmer />);
    ConfirmState.confirm({
      title: 'Test',
      onConfirm: async () => {
        throw new Error('fail');
      },
    });
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const confirmBtn = screen.getByText('Confirm');
    await userEvent.click(confirmBtn);

    // Dialog should still be open after error
    await waitFor(
      () => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      },
      { timeout: 500 },
    );
  });

  it('onConfirm returning false keeps dialog open', async () => {
    render(<Confirmer />);
    ConfirmState.confirm({
      title: 'Test',
      onConfirm: async () => false as const,
    });
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const confirmBtn = screen.getByText('Confirm');
    await userEvent.click(confirmBtn);

    await waitFor(
      () => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      },
      { timeout: 500 },
    );
  });

  it('onDismiss throw does not hang promise', async () => {
    render(<Confirmer />);
    const promise = ConfirmState.confirm({
      title: 'Test',
      onDismiss: () => {
        throw new Error('fail');
      },
    });
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const confirmBtn = screen.getByText('Confirm');
    await userEvent.click(confirmBtn);

    const result = await waitFor(() => promise, { timeout: 500 });
    expect(result).toBe(true);
  });

  it('onCancel receives reason parameter', async () => {
    const onCancel = vi.fn();
    render(<Confirmer />);
    const promise = ConfirmState.confirm({ title: 'Test', onCancel });
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const cancelBtn = screen.getByText('Cancel');
    await userEvent.click(cancelBtn);

    await waitFor(() => expect(onCancel).toHaveBeenCalledWith('button'), { timeout: 500 });
    await promise;
  });

  it('Escape cancel sends "escape" reason', async () => {
    const onCancel = vi.fn();
    render(<Confirmer />);
    const promise = ConfirmState.confirm({ title: 'Test', onCancel });
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    await userEvent.keyboard('{Escape}');

    await waitFor(() => expect(onCancel).toHaveBeenCalledWith('escape'), { timeout: 500 });
    await promise;
  });

  it('translations prop overrides defaults', async () => {
    render(<Confirmer translations={{ confirm: 'Oui', cancel: 'Non' }} />);
    await openDialog({ title: 'Test' });
    expect(screen.getByText('Oui')).toBeInTheDocument();
    expect(screen.getByText('Non')).toBeInTheDocument();
  });

  it('translations ok used in alert mode', async () => {
    render(<Confirmer translations={{ ok: "D'accord" }} />);
    ConfirmState.alert('Notice');
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
    expect(screen.getByText("D'accord")).toBeInTheDocument();
  });

  it('data-size attribute renders for size presets', async () => {
    render(<Confirmer />);
    await openDialog({ title: 'Test', size: 'lg' });
    const dialog = document.querySelector('[data-okayy-dialog]');
    expect(dialog).toHaveAttribute('data-size', 'lg');
  });

  it('aria-busy is set during loading', async () => {
    render(<Confirmer />);
    let resolveConfirm: () => void;
    ConfirmState.confirm({
      title: 'Test',
      onConfirm: () =>
        new Promise<void>((r) => {
          resolveConfirm = r;
        }),
    });
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const confirmBtn = screen.getByText('Confirm');
    await userEvent.click(confirmBtn);

    await waitFor(
      () => {
        const dialog = document.querySelector('[data-okayy-dialog]');
        expect(dialog).toHaveAttribute('aria-busy', 'true');
      },
      { timeout: 500 },
    );

    resolveConfirm!();
  });

  it('aria-invalid on keyword input when not matching', async () => {
    render(<Confirmer />);
    await openDialog({ title: 'Delete?', confirmationKeyword: 'DELETE' });
    const input = document.querySelector('[data-okayy-keyword-input]') as HTMLInputElement;
    expect(input).toHaveAttribute('aria-invalid', 'true');

    fireEvent.change(input, { target: { value: 'DELETE' } });
    await waitFor(() => {
      expect(input).not.toHaveAttribute('aria-invalid');
    });
  });

  it('screen reader loading announcement appears during loading', async () => {
    render(<Confirmer />);
    let resolveConfirm: () => void;
    ConfirmState.confirm({
      title: 'Test',
      onConfirm: () =>
        new Promise<void>((r) => {
          resolveConfirm = r;
        }),
    });
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const confirmBtn = screen.getByText('Confirm');
    await userEvent.click(confirmBtn);

    await waitFor(
      () => {
        expect(screen.getByRole('status')).toBeInTheDocument();
        expect(screen.getByRole('status')).toHaveTextContent('Loading...');
      },
      { timeout: 500 },
    );

    resolveConfirm!();
  });

  it('icon wrapper has aria-hidden', async () => {
    render(<Confirmer />);
    await openAlertDialog({ title: 'Danger!', variant: 'danger' });
    const iconEl = document.querySelector('[data-okayy-icon]');
    expect(iconEl).toHaveAttribute('aria-hidden', 'true');
  });

  it('action button error keeps dialog open', async () => {
    render(<Confirmer />);
    ConfirmState.confirm({
      title: 'Test',
      actions: [
        {
          label: 'Act',
          onClick: async () => {
            throw new Error('fail');
          },
        },
      ],
    });
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const actionBtn = screen.getByText('Act');
    await userEvent.click(actionBtn);

    await waitFor(
      () => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      },
      { timeout: 500 },
    );
  });

  it('fires CustomEvents on close', async () => {
    const confirmHandler = vi.fn();
    const closeHandler = vi.fn();
    window.addEventListener('okayy:confirm', confirmHandler);
    window.addEventListener('okayy:close', closeHandler);

    render(<Confirmer />);
    const promise = ConfirmState.confirm('Test');
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const confirmBtn = screen.getByText('Confirm');
    await userEvent.click(confirmBtn);

    await waitFor(
      () => {
        expect(confirmHandler).toHaveBeenCalled();
        expect(closeHandler).toHaveBeenCalled();
      },
      { timeout: 500 },
    );

    window.removeEventListener('okayy:confirm', confirmHandler);
    window.removeEventListener('okayy:close', closeHandler);
    await promise;
  });
});
