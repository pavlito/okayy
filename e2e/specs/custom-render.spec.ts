import { test, expect } from '../fixtures/okayy.fixture';

test.describe('Custom Render', () => {
  test('renders custom content inside dialog', async ({ okayy }) => {
    await okayy.trigger('custom-render');
    const customBody = okayy.page.locator('[data-testid="custom-body"]');
    await expect(customBody).toBeVisible();
    await expect(customBody.locator('p')).toHaveText('Custom content');
  });

  test('dialog has data-custom attribute', async ({ okayy }) => {
    await okayy.trigger('custom-render');
    await expect(okayy.dialog).toHaveAttribute('data-custom', '');
  });

  test('custom close(true) closes dialog', async ({ okayy }) => {
    await okayy.trigger('custom-render');
    await okayy.page.locator('[data-testid="custom-close-true"]').click();
    await okayy.waitForClose();
  });

  test('custom close(false) closes dialog', async ({ okayy }) => {
    await okayy.trigger('custom-render');
    await okayy.page.locator('[data-testid="custom-close-false"]').click();
    await okayy.waitForClose();
  });

  test('no default buttons in custom render', async ({ okayy }) => {
    await okayy.trigger('custom-render');
    await expect(okayy.confirmBtn).not.toBeVisible();
    await expect(okayy.cancelBtn).not.toBeVisible();
  });
});
