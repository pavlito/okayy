import { test, expect } from '../fixtures/okayy.fixture';

test.describe('Basic Flow', () => {
  test('opens dialog on button click', async ({ okayy }) => {
    await okayy.trigger('basic');
    await okayy.expectOpen();
  });

  test('displays title text', async ({ okayy }) => {
    await okayy.trigger('basic');
    await expect(okayy.title).toHaveText('Are you sure?');
  });

  test('displays description', async ({ okayy }) => {
    await okayy.trigger('with-description');
    await expect(okayy.title).toHaveText('Delete?');
    await expect(okayy.description).toHaveText('This cannot be undone.');
  });

  test('confirm button closes dialog', async ({ okayy }) => {
    await okayy.trigger('basic');
    await okayy.confirm();
    await okayy.waitForClose();
  });

  test('cancel button closes dialog', async ({ okayy }) => {
    await okayy.trigger('basic');
    await okayy.cancel();
    await okayy.waitForClose();
  });

  test('escape key closes dialog', async ({ okayy }) => {
    await okayy.trigger('basic');
    await okayy.pressEscape();
    await okayy.waitForClose();
  });

  test('overlay click closes dialog', async ({ okayy }) => {
    await okayy.trigger('basic');
    await okayy.clickOverlay();
    await okayy.waitForClose();
  });

  test('custom button text renders', async ({ okayy }) => {
    await okayy.trigger('custom-buttons');
    await expect(okayy.confirmBtn).toHaveText('Yes');
    await expect(okayy.cancelBtn).toHaveText('No');
  });
});
