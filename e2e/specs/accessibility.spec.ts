import { test, expect } from '../fixtures/okayy.fixture';

test.describe('Accessibility', () => {
  test('aria-modal is true on dialog', async ({ okayy }) => {
    await okayy.trigger('basic');
    await expect(okayy.dialog).toHaveAttribute('aria-modal', 'true');
  });

  test('aria-labelledby points to title element', async ({ okayy }) => {
    await okayy.trigger('basic');

    const labelledBy = await okayy.dialog.getAttribute('aria-labelledby');
    expect(labelledBy).toBeTruthy();

    const titleEl = okayy.page.locator(`[id="${labelledBy}"]`);
    await expect(titleEl).toHaveText('Are you sure?');
  });

  test('aria-describedby points to description element', async ({ okayy }) => {
    await okayy.trigger('with-description');

    const describedBy = await okayy.dialog.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();

    const descEl = okayy.page.locator(`[id="${describedBy}"]`);
    await expect(descEl).toHaveText('This cannot be undone.');
  });

  test('role="status" on loading announcement element', async ({ okayy }) => {
    await okayy.trigger('async-confirm');
    await okayy.confirm();
    await expect(okayy.spinner).toBeVisible();

    const srOnly = okayy.page.locator('[data-okayy-sr-only]');
    await expect(srOnly).toHaveAttribute('role', 'status');
  });

  test('icon has aria-hidden="true"', async ({ okayy }) => {
    await okayy.trigger('danger');

    const icon = okayy.page.locator('[data-okayy-icon]');
    await expect(icon).toHaveAttribute('aria-hidden', 'true');
  });
});
