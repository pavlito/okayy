import { describe, it, expect, afterEach, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useOkayy } from '../hooks';
import { ConfirmState, confirm } from '../state';

describe('useOkayy', () => {
  beforeEach(() => {
    if (ConfirmState.getSnapshot().isOpen) {
      ConfirmState.respond(false);
    }
    confirm.clearQueue();
  });

  afterEach(() => {
    if (ConfirmState.getSnapshot().isOpen) {
      ConfirmState.respond(false);
    }
    confirm.clearQueue();
  });

  it('returns initial closed state', () => {
    const { result } = renderHook(() => useOkayy());
    expect(result.current.state.isOpen).toBe(false);
  });

  it('updates when confirm is called', () => {
    const { result } = renderHook(() => useOkayy());

    act(() => {
      ConfirmState.confirm('Are you sure?');
    });

    expect(result.current.state.isOpen).toBe(true);
    expect(result.current.state.options.title).toBe('Are you sure?');
  });

  it('updates when dialog is responded to', () => {
    const { result } = renderHook(() => useOkayy());

    act(() => {
      ConfirmState.confirm('Delete?');
    });

    expect(result.current.state.isOpen).toBe(true);

    act(() => {
      ConfirmState.respond(true);
    });

    expect(result.current.state.isOpen).toBe(false);
  });
});
