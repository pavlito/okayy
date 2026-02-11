import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import { Confirmer } from '../confirmer';
import { ConfirmState } from '../state';

vi.spyOn(window, 'matchMedia').mockReturnValue({
  matches: false,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
} as unknown as MediaQueryList);

vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
  cb(0);
  return 0;
});

describe('RTL support', () => {
  afterEach(() => {
    cleanup();
    if (ConfirmState.getSnapshot().isOpen) {
      ConfirmState.respond(false);
    }
    document.body.querySelectorAll('[data-affirm]').forEach((el) => el.remove());
    vi.restoreAllMocks();

    // Re-apply mocks after restore
    vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as MediaQueryList);

    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      cb(0);
      return 0;
    });
  });

  it('sets dir="rtl" on the portal wrapper when dir prop is "rtl"', async () => {
    render(<Confirmer dir="rtl" />);
    ConfirmState.confirm({ title: 'Test' });

    await waitFor(() => {
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    });

    const wrapper = document.querySelector('[data-affirm]');
    expect(wrapper).not.toBeNull();
    expect(wrapper!.getAttribute('dir')).toBe('rtl');
  });

  it('sets dir="ltr" on the portal wrapper when dir prop is "ltr"', async () => {
    render(<Confirmer dir="ltr" />);
    ConfirmState.confirm({ title: 'Test' });

    await waitFor(() => {
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    });

    const wrapper = document.querySelector('[data-affirm]');
    expect(wrapper).not.toBeNull();
    expect(wrapper!.getAttribute('dir')).toBe('ltr');
  });

  it('does not set dir attribute when dir prop is not provided', async () => {
    render(<Confirmer />);
    ConfirmState.confirm({ title: 'Test' });

    await waitFor(() => {
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    });

    const wrapper = document.querySelector('[data-affirm]');
    expect(wrapper).not.toBeNull();
    expect(wrapper!.hasAttribute('dir')).toBe(false);
  });
});
