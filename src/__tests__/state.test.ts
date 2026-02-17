import { describe, it, expect, vi, beforeEach } from 'vitest';
import { confirm, ConfirmState } from '../state';

describe('state', () => {
  beforeEach(() => {
    // Ensure clean state before each test
    if (ConfirmState.getSnapshot().isOpen) {
      ConfirmState.respond(false);
    }
    confirm.clearQueue();
  });

  it('initial state is closed', () => {
    const state = ConfirmState.getSnapshot();
    expect(state.isOpen).toBe(false);
    expect(state.resolve).toBeNull();
  });

  it('confirm() opens dialog and returns a Promise', () => {
    const promise = confirm('Delete this?');
    expect(promise).toBeInstanceOf(Promise);
    const state = ConfirmState.getSnapshot();
    expect(state.isOpen).toBe(true);
    expect(state.options.title).toBe('Delete this?');
    ConfirmState.respond(false);
  });

  it('confirm() accepts string shorthand', () => {
    confirm('Are you sure?');
    const state = ConfirmState.getSnapshot();
    expect(state.options.title).toBe('Are you sure?');
    ConfirmState.respond(false);
  });

  it('confirm() accepts options object', () => {
    confirm({ title: 'Delete?', variant: 'danger', confirmText: 'Yes' });
    const state = ConfirmState.getSnapshot();
    expect(state.options.title).toBe('Delete?');
    expect(state.options.variant).toBe('danger');
    expect(state.options.confirmText).toBe('Yes');
    ConfirmState.respond(false);
  });

  it('respond(true) resolves the Promise with true', async () => {
    const promise = confirm('Delete?');
    ConfirmState.respond(true);
    const result = await promise;
    expect(result).toBe(true);
  });

  it('respond(false) resolves the Promise with false', async () => {
    const promise = confirm('Delete?');
    ConfirmState.respond(false);
    const result = await promise;
    expect(result).toBe(false);
  });

  it('respond() resets state to closed', () => {
    confirm('Delete?');
    ConfirmState.respond(true);
    const state = ConfirmState.getSnapshot();
    expect(state.isOpen).toBe(false);
    expect(state.resolve).toBeNull();
  });

  it('subscribe() notifies listeners on confirm and respond', () => {
    const listener = vi.fn();
    const unsub = ConfirmState.subscribe(listener);
    confirm('Delete?');
    expect(listener).toHaveBeenCalledTimes(1);
    ConfirmState.respond(false);
    expect(listener).toHaveBeenCalledTimes(2);
    unsub();
  });

  it('unsubscribe removes the listener', () => {
    const listener = vi.fn();
    const unsub = ConfirmState.subscribe(listener);
    unsub();
    confirm('Delete?');
    expect(listener).not.toHaveBeenCalled();
    ConfirmState.respond(false);
  });

  it('confirm.dismiss() is a no-op when no dialog is open', () => {
    const listener = vi.fn();
    const unsub = ConfirmState.subscribe(listener);
    confirm.dismiss();
    // dismiss() now returns early when not open
    expect(listener).not.toHaveBeenCalled();
    unsub();
  });

  it('confirm.dismiss() increments dismissCount when dialog is open', () => {
    confirm('Delete?');
    const before = ConfirmState.getSnapshot().dismissCount || 0;
    confirm.dismiss();
    const after = ConfirmState.getSnapshot().dismissCount || 0;
    expect(after).toBe(before + 1);
    // Still open - dismiss doesn't close directly, component handles it
    expect(ConfirmState.getSnapshot().isOpen).toBe(true);
    ConfirmState.respond(false);
  });

  it('confirm.alert() sets hideCancel to true', () => {
    confirm.alert('Notice');
    const state = ConfirmState.getSnapshot();
    expect(state.isOpen).toBe(true);
    expect(state.options.title).toBe('Notice');
    expect(state.options.hideCancel).toBe(true);
    ConfirmState.respond(true);
  });

  it('confirm.alert() accepts options object', () => {
    confirm.alert({ title: 'Alert!', variant: 'info' });
    const state = ConfirmState.getSnapshot();
    expect(state.options.title).toBe('Alert!');
    expect(state.options.variant).toBe('info');
    expect(state.options.hideCancel).toBe(true);
    ConfirmState.respond(true);
  });

  it('confirm.alert() returns a Promise', async () => {
    const promise = confirm.alert('OK?');
    expect(promise).toBeInstanceOf(Promise);
    ConfirmState.respond(true);
    const result = await promise;
    expect(result).toBe(true);
  });

  it('variant shortcuts set the variant', async () => {
    const p1 = confirm.danger({ title: 'Danger?' });
    expect(ConfirmState.getSnapshot().options.variant).toBe('danger');
    ConfirmState.respond(false);
    await p1;

    const p2 = confirm.warning({ title: 'Warning?' });
    expect(ConfirmState.getSnapshot().options.variant).toBe('warning');
    ConfirmState.respond(false);
    await p2;

    const p3 = confirm.info({ title: 'Info?' });
    expect(ConfirmState.getSnapshot().options.variant).toBe('info');
    ConfirmState.respond(false);
    await p3;

    const p4 = confirm.success({ title: 'Success?' });
    expect(ConfirmState.getSnapshot().options.variant).toBe('success');
    ConfirmState.respond(false);
    await p4;
  });

  it('confirm.custom() opens dialog with custom render function', () => {
    const render = (_close: (value: boolean) => void) => null;
    confirm.custom(render);
    const state = ConfirmState.getSnapshot();
    expect(state.isOpen).toBe(true);
    expect(state.options.custom).toBe(render);
    ConfirmState.respond(false);
  });

  it('confirm.custom() returns a Promise that resolves on respond', async () => {
    const render = (_close: (value: boolean) => void) => null;
    const promise = confirm.custom(render);
    ConfirmState.respond(true);
    const result = await promise;
    expect(result).toBe(true);
  });

  it('confirm.isOpen() returns false when no dialog is open', () => {
    expect(confirm.isOpen()).toBe(false);
  });

  it('confirm.isOpen() returns true when dialog is open', () => {
    confirm('Test');
    expect(confirm.isOpen()).toBe(true);
    ConfirmState.respond(false);
  });

  it('variant shortcuts accept options object', async () => {
    const p = confirm.danger({ title: 'Delete?' });
    const state = ConfirmState.getSnapshot();
    expect(state.options.variant).toBe('danger');
    expect(state.options.title).toBe('Delete?');
    ConfirmState.respond(false);
    await p;
  });

  // --- Queue tests ---

  it('second confirm() queues when dialog is open', async () => {
    const p1 = confirm('First');
    const p2 = confirm('Second');

    // First is shown
    expect(ConfirmState.getSnapshot().options.title).toBe('First');

    // Respond to first
    ConfirmState.respond(true);
    const r1 = await p1;
    expect(r1).toBe(true);

    // Wait for microtask to process queue
    await new Promise((r) => setTimeout(r, 0));

    // Second should now be shown
    expect(ConfirmState.getSnapshot().isOpen).toBe(true);
    expect(ConfirmState.getSnapshot().options.title).toBe('Second');

    ConfirmState.respond(false);
    const r2 = await p2;
    expect(r2).toBe(false);
  });

  it('clearQueue() resolves pending promises with false', async () => {
    confirm('First');
    const p2 = confirm('Second');
    const p3 = confirm('Third');

    confirm.clearQueue();

    const r2 = await p2;
    const r3 = await p3;
    expect(r2).toBe(false);
    expect(r3).toBe(false);

    ConfirmState.respond(false); // cleanup first
  });

  it('respond() double-call guard prevents multiple resolves', () => {
    confirm('Test');
    ConfirmState.respond(true);
    // Second call should be a no-op (isOpen is already false)
    ConfirmState.respond(false);
    expect(ConfirmState.getSnapshot().isOpen).toBe(false);
  });

  it('custom() uses queue when dialog is already open', async () => {
    const p1 = confirm('First');
    const render = (_close: (value: boolean) => void) => null;
    const p2 = confirm.custom(render);

    expect(ConfirmState.getSnapshot().options.title).toBe('First');

    ConfirmState.respond(true);
    await p1;

    await new Promise((r) => setTimeout(r, 0));

    expect(ConfirmState.getSnapshot().isOpen).toBe(true);
    expect(ConfirmState.getSnapshot().options.custom).toBe(render);

    ConfirmState.respond(false);
    await p2;
  });
});
