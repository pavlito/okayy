import { test, expect } from '../fixtures/okayy.fixture';

test.describe('Custom Events', () => {
  test('okayy:confirm and okayy:close fire on confirm', async ({ okayy }) => {
    await okayy.trigger('listen-events');
    await okayy.confirm();
    await okayy.waitForClose();

    const log = okayy.page.locator('#event-log');
    await expect(log).toHaveText(/confirm,/);
    await expect(log).toHaveText(/close,/);
  });

  test('okayy:cancel and okayy:close fire on cancel', async ({ okayy }) => {
    await okayy.trigger('listen-events');
    await okayy.cancel();
    await okayy.waitForClose();

    const log = okayy.page.locator('#event-log');
    await expect(log).toHaveText(/cancel,/);
    await expect(log).toHaveText(/close,/);
  });

  test('event log matches expected sequence on confirm', async ({ okayy }) => {
    await okayy.trigger('listen-events');
    await okayy.confirm();
    await okayy.waitForClose();

    const log = okayy.page.locator('#event-log');
    await expect(log).toHaveText('confirm,close,');
  });
});
