import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createFocusTrap } from '../focus-trap';

describe('createFocusTrap', () => {
  let container: HTMLDivElement;
  let sibling: HTMLDivElement;
  let button1: HTMLButtonElement;
  let button2: HTMLButtonElement;
  let trap: ReturnType<typeof createFocusTrap>;

  beforeEach(() => {
    // Mock requestAnimationFrame to execute callback synchronously
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      cb(0);
      return 0;
    });

    container = document.createElement('div');
    sibling = document.createElement('div');
    button1 = document.createElement('button');
    button2 = document.createElement('button');
    button1.textContent = 'First';
    button2.textContent = 'Second';
    container.appendChild(button1);
    container.appendChild(button2);
    document.body.appendChild(sibling);
    document.body.appendChild(container);
    trap = createFocusTrap(container);
  });

  afterEach(() => {
    trap.deactivate();
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('sets inert on sibling elements when activated', () => {
    trap.activate();
    expect(sibling.hasAttribute('inert')).toBe(true);
  });

  it('does not set inert on the container itself', () => {
    trap.activate();
    expect(container.hasAttribute('inert')).toBe(false);
  });

  it('removes inert on deactivate', () => {
    trap.activate();
    trap.deactivate();
    expect(sibling.hasAttribute('inert')).toBe(false);
  });

  it('focuses the first focusable element by default', () => {
    trap.activate();
    expect(document.activeElement).toBe(button1);
  });

  it('focuses a custom initial element when provided', () => {
    trap.activate(button2);
    expect(document.activeElement).toBe(button2);
  });

  it('restores focus to previously focused element on deactivate', () => {
    const outsideButton = document.createElement('button');
    document.body.appendChild(outsideButton);
    outsideButton.focus();
    expect(document.activeElement).toBe(outsideButton);

    trap.activate();
    expect(document.activeElement).toBe(button1);

    trap.deactivate();
    expect(document.activeElement).toBe(outsideButton);
  });

  it('wraps Tab from last to first element', () => {
    trap.activate();
    button2.focus();

    const focusSpy = vi.spyOn(button1, 'focus');

    const event = new KeyboardEvent('keydown', {
      key: 'Tab',
      bubbles: true,
    });

    button2.dispatchEvent(event);
    expect(focusSpy).toHaveBeenCalled();
  });

  it('wraps Shift+Tab from first to last element', () => {
    trap.activate();
    button1.focus();

    const focusSpy = vi.spyOn(button2, 'focus');

    const event = new KeyboardEvent('keydown', {
      key: 'Tab',
      shiftKey: true,
      bubbles: true,
    });

    button1.dispatchEvent(event);
    expect(focusSpy).toHaveBeenCalled();
  });
});
