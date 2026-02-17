import { test, expect } from '../fixtures/okayy.fixture';

test.describe('Advanced', () => {
  test('alert mode: no cancel button, confirm text is "OK"', async ({ okayy }) => {
    await okayy.trigger('alert');
    await expect(okayy.confirmBtn).toBeVisible();
    await expect(okayy.confirmBtn).toHaveText('OK');
    await expect(okayy.cancelBtn).not.toBeVisible();
  });

  test('custom actions render extra buttons', async ({ okayy }) => {
    await okayy.trigger('custom-actions');

    const actionButtons = okayy.page.locator('[data-okayy-action]');
    await expect(actionButtons).toHaveCount(2);
    await expect(actionButtons.nth(0)).toHaveText('Option A');
    await expect(actionButtons.nth(1)).toHaveText('Option B');
  });

  test('data-size attribute on dialog', async ({ okayy }) => {
    await okayy.trigger('size-sm');
    await expect(okayy.dialog).toHaveAttribute('data-size', 'sm');
    await okayy.confirm();
    await okayy.waitForClose();

    await okayy.trigger('size-lg');
    await expect(okayy.dialog).toHaveAttribute('data-size', 'lg');
  });

  test('data-testid propagation to dialog', async ({ okayy }) => {
    await okayy.trigger('with-testid');
    await expect(okayy.dialog).toHaveAttribute('data-testid', 'my-dialog');
  });

  test('size-full has full-width max-width', async ({ okayy }, testInfo) => {
    test.skip(testInfo.project.name.includes('mobile'), 'Mobile uses full-width dialogs');
    await okayy.trigger('size-full');
    await expect(okayy.dialog).toHaveAttribute('data-size', 'full');
    const maxWidth = await okayy.dialog.evaluate((el) => getComputedStyle(el).maxWidth);
    // full size uses calc(100vw - 2rem) or similar — should be very large
    const px = parseFloat(maxWidth);
    expect(px).toBeGreaterThan(600);
  });

  test('ariaLabel overrides aria-labelledby', async ({ okayy }) => {
    await okayy.trigger('aria-label');
    await expect(okayy.dialog).toHaveAttribute('aria-label', 'Custom accessible label');
  });

  test('inline style applies to dialog', async ({ okayy }) => {
    await okayy.trigger('inline-style');
    const borderRadius = await okayy.dialog.evaluate((el) => getComputedStyle(el).borderRadius);
    expect(borderRadius).toBe('16px'); // 1rem = 16px
  });

  test('size presets affect max-width', async ({ okayy }, testInfo) => {
    test.skip(testInfo.project.name.includes('mobile'), 'Mobile uses full-width dialogs');
    await okayy.trigger('size-sm');
    const smMaxWidth = await okayy.dialog.evaluate((el) => getComputedStyle(el).maxWidth);
    await okayy.confirm();
    await okayy.waitForClose();

    await okayy.trigger('size-xl');
    const xlMaxWidth = await okayy.dialog.evaluate((el) => getComputedStyle(el).maxWidth);

    // Parse to numbers for comparison (sm: 22rem, xl: 48rem)
    const smPx = parseFloat(smMaxWidth);
    const xlPx = parseFloat(xlMaxWidth);
    expect(xlPx).toBeGreaterThan(smPx);
  });
});
