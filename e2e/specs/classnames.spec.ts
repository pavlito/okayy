import { test, expect } from '../fixtures/okayy.fixture';

test.describe('ClassNames', () => {
  test('dialog receives custom class', async ({ okayy }) => {
    await okayy.trigger('classnames');
    await expect(okayy.dialog).toHaveClass(/custom-dialog-class/);
  });

  test('overlay receives custom class', async ({ okayy }) => {
    await okayy.trigger('classnames');
    await expect(okayy.overlay).toHaveClass(/custom-overlay-class/);
  });

  test('title receives custom class', async ({ okayy }) => {
    await okayy.trigger('classnames');
    await expect(okayy.title).toHaveClass(/custom-title-class/);
  });

  test('description receives custom class', async ({ okayy }) => {
    await okayy.trigger('classnames');
    await expect(okayy.description).toHaveClass(/custom-desc-class/);
  });

  test('confirm button receives custom class', async ({ okayy }) => {
    await okayy.trigger('classnames');
    await expect(okayy.confirmBtn).toHaveClass(/custom-confirm-class/);
  });

  test('cancel button receives custom class', async ({ okayy }) => {
    await okayy.trigger('classnames');
    await expect(okayy.cancelBtn).toHaveClass(/custom-cancel-class/);
  });

  test('content receives custom class', async ({ okayy }) => {
    await okayy.trigger('classnames');
    const content = okayy.page.locator('[data-okayy-content]');
    await expect(content).toHaveClass(/custom-content-class/);
  });

  test('footer receives custom class', async ({ okayy }) => {
    await okayy.trigger('classnames');
    const footer = okayy.page.locator('[data-okayy-footer]');
    await expect(footer).toHaveClass(/custom-footer-class/);
  });

  test('overlayClassName applies to overlay', async ({ okayy }) => {
    await okayy.trigger('overlay-class');
    await expect(okayy.overlay).toHaveClass(/my-overlay-class/);
  });
});
