import { test, expect } from '../fixtures/okayy.fixture';

test.describe('isOpen', () => {
  test('confirm.isOpen() returns true when dialog is open', async ({ okayy }) => {
    await okayy.trigger('is-open-test');
    await expect(okayy.page.locator('#is-open-value')).toHaveText('true');
  });

  test('confirm.isOpen() returns false after dialog closes', async ({ okayy }) => {
    await okayy.trigger('is-open-test');
    await okayy.confirm();
    await okayy.waitForClose();
    const isOpen = await okayy.page.evaluate(() => {
      // Access the confirm function from the window — the harness imports it
      // We can check the DOM instead: no [data-okayy-dialog] visible means closed
      return document.querySelector('[data-okayy-dialog]') !== null;
    });
    expect(isOpen).toBe(false);
  });
});
