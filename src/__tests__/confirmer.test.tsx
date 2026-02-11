import { describe, it, expect, afterEach, beforeAll, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Confirmer } from '../confirmer';
import { ConfirmState } from '../state';

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
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
  });
}

describe('Confirmer', () => {
  afterEach(() => {
    // Unmount the component first so portals are cleaned up
    cleanup();
    // Then clean up any lingering state
    if (ConfirmState.getSnapshot().isOpen) {
      ConfirmState.respond(false);
    }
    // Remove any stale portal elements from document.body
    document.body.querySelectorAll('[data-affirm]').forEach((el) => el.remove());
  });

  it('renders nothing when no dialog is open', () => {
    render(<Confirmer />);
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });

  it('renders the dialog when confirm() is called', async () => {
    render(<Confirmer />);
    await openDialog();
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
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
    expect(screen.getByRole('alertdialog')).toHaveAttribute('aria-modal', 'true');
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
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    });
    expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
  });

  it('sets data-variant attribute', async () => {
    render(<Confirmer />);
    await openDialog({ title: 'Danger!', variant: 'danger' });
    const dialog = screen.getByRole('alertdialog');
    expect(dialog).toHaveAttribute('data-variant', 'danger');
  });

  it('resolves with true when Confirm button is clicked', async () => {
    render(<Confirmer />);
    const promise = ConfirmState.confirm('Delete?');
    await waitFor(() => {
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
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
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
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
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    });

    await userEvent.keyboard('{Escape}');

    const result = await waitFor(() => promise, { timeout: 500 });
    expect(result).toBe(false);
  });

  it('does not dismiss on Escape when dismissible is false', async () => {
    render(<Confirmer />);
    ConfirmState.confirm({ title: 'Delete?', dismissible: false });
    await waitFor(() => {
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    });

    await userEvent.keyboard('{Escape}');

    // Dialog should still be open
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
  });

  it('applies data-testid when testId option is set', async () => {
    render(<Confirmer />);
    await openDialog({ title: 'Test', testId: 'my-dialog' });
    expect(document.querySelector('[data-testid="my-dialog"]')).toBeInTheDocument();
    expect(document.querySelector('[data-testid="my-dialog-confirm"]')).toBeInTheDocument();
    expect(document.querySelector('[data-testid="my-dialog-cancel"]')).toBeInTheDocument();
  });

  it('calls onDismiss when confirmed', async () => {
    const onDismiss = vi.fn();
    render(<Confirmer />);
    const promise = ConfirmState.confirm({ title: 'Delete?', onDismiss });
    await waitFor(() => {
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
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
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
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
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    });

    await userEvent.keyboard('{Escape}');

    await waitFor(() => expect(onDismiss).toHaveBeenCalledTimes(1), { timeout: 500 });
    await promise;
  });

  it('disables confirm button until confirmationKeyword is typed', async () => {
    render(<Confirmer />);
    ConfirmState.confirm({ title: 'Delete?', confirmationKeyword: 'DELETE' });
    await waitFor(() => {
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    });

    const confirmBtn = screen.getByText('Confirm').closest('button')!;
    expect(confirmBtn).toBeDisabled();

    const input = document.querySelector('[data-affirm-keyword-input]') as HTMLInputElement;
    await userEvent.type(input, 'DELETE');

    await waitFor(() => {
      expect(confirmBtn).not.toBeDisabled();
    });
  });
});
