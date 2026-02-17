import { test, expect } from '../fixtures/okayy.fixture';

test.describe('Variants', () => {
  test('danger variant has alertdialog role and icon', async ({ okayy }) => {
    await okayy.trigger('danger');
    await expect(okayy.dialog).toHaveAttribute('role', 'alertdialog');
    await expect(okayy.dialog).toHaveAttribute('data-variant', 'danger');
    await expect(okayy.page.locator('[data-okayy-icon]')).toBeVisible();
  });

  test('warning variant has alertdialog role and icon', async ({ okayy }) => {
    await okayy.trigger('warning');
    await expect(okayy.dialog).toHaveAttribute('role', 'alertdialog');
    await expect(okayy.dialog).toHaveAttribute('data-variant', 'warning');
    await expect(okayy.page.locator('[data-okayy-icon]')).toBeVisible();
  });

  test('info variant has dialog role', async ({ okayy }) => {
    await okayy.trigger('info');
    await expect(okayy.dialog).toHaveAttribute('role', 'dialog');
    await expect(okayy.dialog).toHaveAttribute('data-variant', 'info');
  });

  test('success variant has dialog role and icon', async ({ okayy }) => {
    await okayy.trigger('success');
    await expect(okayy.dialog).toHaveAttribute('role', 'dialog');
    await expect(okayy.dialog).toHaveAttribute('data-variant', 'success');
    await expect(okayy.page.locator('[data-okayy-icon]')).toBeVisible();
  });

  test('default variant has dialog role', async ({ okayy }) => {
    await okayy.trigger('basic');
    await expect(okayy.dialog).toHaveAttribute('role', 'dialog');
    await expect(okayy.dialog).toHaveAttribute('data-variant', 'default');
  });
});
