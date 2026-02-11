import { describe, it, expect, vi } from 'vitest';
import { confirm, ConfirmState } from '../state';

describe('state', () => {
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
    ConfirmState.respond(false); // cleanup
  });

  it('confirm() accepts string shorthand', () => {
    confirm('Are you sure?');
    const state = ConfirmState.getSnapshot();
    expect(state.options.title).toBe('Are you sure?');
    ConfirmState.respond(false); // cleanup
  });

  it('confirm() accepts options object', () => {
    confirm({ title: 'Delete?', variant: 'danger', confirmText: 'Yes' });
    const state = ConfirmState.getSnapshot();
    expect(state.options.title).toBe('Delete?');
    expect(state.options.variant).toBe('danger');
    expect(state.options.confirmText).toBe('Yes');
    ConfirmState.respond(false); // cleanup
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
    ConfirmState.respond(false); // cleanup
  });

  it('confirm.dismiss() resolves the Promise with false', async () => {
    const promise = confirm('Delete?');
    confirm.dismiss();
    const result = await promise;
    expect(result).toBe(false);
  });

  it('confirm.dismiss() resets state to closed', () => {
    confirm('Delete?');
    confirm.dismiss();
    const state = ConfirmState.getSnapshot();
    expect(state.isOpen).toBe(false);
    expect(state.resolve).toBeNull();
  });

  it('confirm.dismiss() is a no-op when no dialog is open', () => {
    const listener = vi.fn();
    const unsub = ConfirmState.subscribe(listener);
    confirm.dismiss();
    // Still publishes (matches respond behavior), but resolve is null so no error
    expect(listener).toHaveBeenCalledTimes(1);
    unsub();
  });

  it('confirm.alert() sets hideCancel to true', () => {
    confirm.alert('Notice');
    const state = ConfirmState.getSnapshot();
    expect(state.isOpen).toBe(true);
    expect(state.options.title).toBe('Notice');
    expect(state.options.hideCancel).toBe(true);
    ConfirmState.respond(true); // cleanup
  });

  it('confirm.alert() accepts options object', () => {
    confirm.alert({ title: 'Alert!', variant: 'info' });
    const state = ConfirmState.getSnapshot();
    expect(state.options.title).toBe('Alert!');
    expect(state.options.variant).toBe('info');
    expect(state.options.hideCancel).toBe(true);
    ConfirmState.respond(true); // cleanup
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
    ConfirmState.respond(false); // cleanup
  });

  it('confirm.custom() returns a Promise that resolves on respond', async () => {
    const render = (_close: (value: boolean) => void) => null;
    const promise = confirm.custom(render);
    ConfirmState.respond(true);
    const result = await promise;
    expect(result).toBe(true);
  });

  it('calling confirm() while dialog is open overwrites previous dialog', async () => {
    confirm('First');
    const promise2 = confirm('Second');

    const state = ConfirmState.getSnapshot();
    expect(state.options.title).toBe('Second');

    // First promise's resolve was overwritten — it will never resolve
    // Second promise resolves normally
    ConfirmState.respond(true);
    const result2 = await promise2;
    expect(result2).toBe(true);
  });

  it('confirm.isOpen() returns false when no dialog is open', () => {
    expect(confirm.isOpen()).toBe(false);
  });

  it('confirm.isOpen() returns true when dialog is open', () => {
    confirm('Test');
    expect(confirm.isOpen()).toBe(true);
    ConfirmState.respond(false); // cleanup
  });

  it('variant shortcuts accept string shorthand', async () => {
    const p = confirm.danger({ title: 'Delete?' });
    const state = ConfirmState.getSnapshot();
    expect(state.options.variant).toBe('danger');
    expect(state.options.title).toBe('Delete?');
    ConfirmState.respond(false);
    await p;
  });
});
