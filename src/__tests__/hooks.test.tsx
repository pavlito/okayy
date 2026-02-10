import { describe, it, expect, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAffirm } from '../hooks';
import { ConfirmState } from '../state';

describe('useAffirm', () => {
  afterEach(() => {
    if (ConfirmState.getSnapshot().isOpen) {
      ConfirmState.respond(false);
    }
  });

  it('returns initial closed state', () => {
    const { result } = renderHook(() => useAffirm());
    expect(result.current.state.isOpen).toBe(false);
  });

  it('updates when confirm is called', async () => {
    const { result } = renderHook(() => useAffirm());

    act(() => {
      ConfirmState.confirm('Are you sure?');
    });

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(result.current.state.isOpen).toBe(true);
    expect(result.current.state.options.title).toBe('Are you sure?');
  });

  it('updates when dialog is responded to', async () => {
    const { result } = renderHook(() => useAffirm());

    act(() => {
      ConfirmState.confirm('Delete?');
    });

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(result.current.state.isOpen).toBe(true);

    act(() => {
      ConfirmState.respond(true);
    });

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(result.current.state.isOpen).toBe(false);
  });
});
