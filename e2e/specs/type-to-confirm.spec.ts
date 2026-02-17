import { test, expect } from '../fixtures/okayy.fixture';

test.describe('Type to Confirm', () => {
  test('confirm button disabled initially', async ({ okayy }) => {
    await okayy.trigger('keyword');
    await expect(okayy.confirmBtn).toBeDisabled();
  });

  test('wrong keyword keeps button disabled', async ({ okayy }) => {
    await okayy.trigger('keyword');
    await okayy.keywordInput.fill('WRONG');
    await expect(okayy.confirmBtn).toBeDisabled();
  });

  test('correct keyword enables confirm button', async ({ okayy }) => {
    await okayy.trigger('keyword');
    await okayy.keywordInput.fill('DELETE');
    await expect(okayy.confirmBtn).toBeEnabled();
  });

  test('aria-invalid present when keyword does not match', async ({ okayy }) => {
    await okayy.trigger('keyword');
    await expect(okayy.keywordInput).toHaveAttribute('aria-invalid', 'true');
    await okayy.keywordInput.fill('WRONG');
    await expect(okayy.keywordInput).toHaveAttribute('aria-invalid', 'true');
    await okayy.keywordInput.fill('DELETE');
    await expect(okayy.keywordInput).not.toHaveAttribute('aria-invalid');
  });
});
