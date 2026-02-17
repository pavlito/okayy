import { test, expect } from '../fixtures/okayy.fixture';

test.describe('Dialog Queue', () => {
  test('first queued dialog is shown', async ({ okayy }) => {
    await okayy.trigger('queue-3');
    await expect(okayy.title).toHaveText('First');
  });

  test('confirming first shows second', async ({ okayy }) => {
    await okayy.trigger('queue-3');
    await expect(okayy.title).toHaveText('First');
    await okayy.confirm();
    await expect(okayy.title).toHaveText('Second');
  });

  test('confirming second shows third', async ({ okayy }) => {
    await okayy.trigger('queue-3');
    await expect(okayy.title).toHaveText('First');
    await okayy.confirm();
    await expect(okayy.title).toHaveText('Second');
    await okayy.confirm();
    await expect(okayy.title).toHaveText('Third');
  });

  test('all three complete in order', async ({ okayy }) => {
    await okayy.trigger('queue-3');
    await expect(okayy.title).toHaveText('First');

    await okayy.confirm();
    await expect(okayy.title).toHaveText('Second');

    await okayy.confirm();
    await expect(okayy.title).toHaveText('Third');

    await okayy.confirm();
    await okayy.waitForClose();
  });
});
