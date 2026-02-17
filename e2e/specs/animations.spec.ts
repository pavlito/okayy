import { test, expect } from '../fixtures/okayy.fixture';

test.describe('Animations', () => {
  test('dialog has data-state="open" when visible', async ({ okayy }) => {
    await okayy.trigger('basic');
    await expect(okayy.dialog).toHaveAttribute('data-state', 'open');
  });

  test('dialog transitions to data-state="closed" on dismiss', async ({ okayy }) => {
    await okayy.trigger('basic');
    await okayy.cancel();
    await expect(okayy.dialog).toHaveAttribute('data-state', 'closed');
    await okayy.waitForClose();
  });

  test('overlay data-state matches dialog state', async ({ okayy }) => {
    await okayy.trigger('basic');
    await expect(okayy.overlay).toHaveAttribute('data-state', 'open');

    await okayy.cancel();
    await expect(okayy.overlay).toHaveAttribute('data-state', 'closed');
    await okayy.waitForClose();
  });

  test('prefers-reduced-motion uses fade-only animation', async ({ okayy }) => {
    await okayy.page.emulateMedia({ reducedMotion: 'reduce' });
    await okayy.trigger('basic');

    const animationName = await okayy.dialog.evaluate((el) => getComputedStyle(el).animationName);
    expect(animationName).toBe('okayy-fade-in');

    await okayy.cancel();
    await okayy.waitForClose();
  });
});
