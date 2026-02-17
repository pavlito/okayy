import { test, expect } from '../fixtures/okayy.fixture';

test.describe('Dismiss', () => {
  test('confirm.dismiss() closes the dialog', async ({ okayy }) => {
    await okayy.trigger('dismiss-test');
    // dismiss() is called after 500ms in the harness
    await okayy.waitForClose();
  });

  test('dismiss triggers onCancel with "dismiss" reason', async ({ okayy }) => {
    await okayy.trigger('dismiss-test');
    await okayy.waitForClose();
    await expect(okayy.page.locator('#dismiss-reason')).toHaveText('dismiss');
  });

  test('dismiss triggers onDismiss callback', async ({ okayy }) => {
    await okayy.trigger('dismiss-test');
    await okayy.waitForClose();
    await expect(okayy.page.locator('#dismiss-called')).toHaveText('yes');
  });

  test('dismiss resolves promise with false', async ({ okayy }) => {
    await okayy.trigger('dismiss-test');
    await okayy.waitForClose();
    await expect(okayy.page.locator('#dismiss-result')).toHaveText('false');
  });
});
