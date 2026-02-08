import { describe, it, expect, vi } from 'vitest';
import { confirm, respond, subscribe, getSnapshot } from '../state';

describe('state', () => {
  it('initial state is closed', () => {
    const state = getSnapshot();
    expect(state.isOpen).toBe(false);
    expect(state.resolve).toBeNull();
  });

  it('confirm() opens dialog and returns a Promise', () => {
    const promise = confirm('Delete this?');
    expect(promise).toBeInstanceOf(Promise);
    const state = getSnapshot();
    expect(state.isOpen).toBe(true);
    expect(state.options.title).toBe('Delete this?');
    respond(false); // cleanup
  });

  it('confirm() accepts string shorthand', () => {
    confirm('Are you sure?');
    const state = getSnapshot();
    expect(state.options.title).toBe('Are you sure?');
    respond(false); // cleanup
  });

  it('confirm() accepts options object', () => {
    confirm({ title: 'Delete?', variant: 'danger', confirmText: 'Yes' });
    const state = getSnapshot();
    expect(state.options.title).toBe('Delete?');
    expect(state.options.variant).toBe('danger');
    expect(state.options.confirmText).toBe('Yes');
    respond(false); // cleanup
  });

  it('respond(true) resolves the Promise with true', async () => {
    const promise = confirm('Delete?');
    respond(true);
    const result = await promise;
    expect(result).toBe(true);
  });

  it('respond(false) resolves the Promise with false', async () => {
    const promise = confirm('Delete?');
    respond(false);
    const result = await promise;
    expect(result).toBe(false);
  });

  it('respond() resets state to closed', () => {
    confirm('Delete?');
    respond(true);
    const state = getSnapshot();
    expect(state.isOpen).toBe(false);
    expect(state.resolve).toBeNull();
  });

  it('subscribe() notifies listeners on confirm and respond', () => {
    const listener = vi.fn();
    const unsub = subscribe(listener);
    confirm('Delete?');
    expect(listener).toHaveBeenCalledTimes(1);
    respond(false);
    expect(listener).toHaveBeenCalledTimes(2);
    unsub();
  });

  it('unsubscribe removes the listener', () => {
    const listener = vi.fn();
    const unsub = subscribe(listener);
    unsub();
    confirm('Delete?');
    expect(listener).not.toHaveBeenCalled();
    respond(false); // cleanup
  });

  it('variant shortcuts set the variant', async () => {
    const p1 = confirm.danger({ title: 'Danger?' });
    expect(getSnapshot().options.variant).toBe('danger');
    respond(false);
    await p1;

    const p2 = confirm.warning({ title: 'Warning?' });
    expect(getSnapshot().options.variant).toBe('warning');
    respond(false);
    await p2;

    const p3 = confirm.info({ title: 'Info?' });
    expect(getSnapshot().options.variant).toBe('info');
    respond(false);
    await p3;

    const p4 = confirm.success({ title: 'Success?' });
    expect(getSnapshot().options.variant).toBe('success');
    respond(false);
    await p4;
  });
});
