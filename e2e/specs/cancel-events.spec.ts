import { test, expect } from '../fixtures/okayy.fixture';

test.describe('Cancel Events', () => {
  test('cancel button sends "button" reason', async ({ okayy }) => {
    await okayy.trigger('cancel-events');
    await okayy.cancel();
    await okayy.waitForClose();
    await expect(okayy.page.locator('#cancel-reason')).toHaveText('button');
    await expect(okayy.page.locator('#confirm-result')).toHaveText('false');
  });

  test('escape sends "escape" reason', async ({ okayy }) => {
    await okayy.trigger('cancel-events');
    await okayy.pressEscape();
    await okayy.waitForClose();
    await expect(okayy.page.locator('#cancel-reason')).toHaveText('escape');
    await expect(okayy.page.locator('#confirm-result')).toHaveText('false');
  });

  test('overlay click sends "overlay" reason', async ({ okayy }) => {
    await okayy.trigger('cancel-events');
    await okayy.clickOverlay();
    await okayy.waitForClose();
    await expect(okayy.page.locator('#cancel-reason')).toHaveText('overlay');
    await expect(okayy.page.locator('#confirm-result')).toHaveText('false');
  });

  test('cancelableWhileLoading allows cancel during loading', async ({ okayy }) => {
    await okayy.trigger('cancelable-loading');
    await okayy.confirm();
    // Spinner should appear (loading in progress)
    await expect(okayy.spinner).toBeVisible();
    // Cancel button should still be enabled
    await expect(okayy.cancelBtn).toBeEnabled();
    await okayy.cancel();
    await okayy.waitForClose();
  });
});
