import { test, expect } from '../fixtures/okayy.fixture';

test.describe('Async Loading', () => {
  test('spinner visible during async confirm', async ({ okayy }) => {
    await okayy.trigger('async-confirm');
    await okayy.confirm();
    await expect(okayy.spinner).toBeVisible();
  });

  test('buttons disabled during loading', async ({ okayy }) => {
    await okayy.trigger('async-confirm');
    await okayy.confirm();
    await expect(okayy.spinner).toBeVisible();
    await expect(okayy.confirmBtn).toBeDisabled();
    await expect(okayy.cancelBtn).toBeDisabled();
  });

  test('aria-busy is true during loading', async ({ okayy }) => {
    await okayy.trigger('async-confirm');
    await okayy.confirm();
    await expect(okayy.spinner).toBeVisible();
    await expect(okayy.dialog).toHaveAttribute('aria-busy', 'true');
  });

  test('error in onConfirm keeps dialog open', async ({ okayy }) => {
    await okayy.trigger('async-error');
    await okayy.confirm();
    // Error is thrown synchronously from the async handler — loading may be too brief to observe
    // Wait a tick for the error to be caught and loading to reset
    await okayy.page.waitForTimeout(200);
    // Dialog should still be open after the error
    await okayy.expectOpen();
    // Confirm button should be re-enabled (not loading anymore)
    await expect(okayy.confirmBtn).toBeEnabled();
  });

  test('returning false from onConfirm keeps dialog open', async ({ okayy }) => {
    await okayy.trigger('async-return-false');
    await okayy.confirm();
    // return false resolves quickly — loading may be too brief to observe
    await okayy.page.waitForTimeout(200);
    // Dialog should still be open
    await okayy.expectOpen();
    await expect(okayy.confirmBtn).toBeEnabled();
  });

  test('dialog closes after successful async confirm', async ({ okayy }) => {
    await okayy.trigger('async-confirm');
    await okayy.confirm();
    await expect(okayy.spinner).toBeVisible();
    await okayy.waitForClose();
  });
});
