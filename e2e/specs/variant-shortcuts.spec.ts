import { test, expect } from '../fixtures/okayy.fixture';

test.describe('Variant Shortcuts', () => {
  test('confirm.danger() sets danger variant', async ({ okayy }) => {
    await okayy.trigger('shortcut-danger');
    await expect(okayy.dialog).toHaveAttribute('data-variant', 'danger');
    await expect(okayy.dialog).toHaveAttribute('role', 'alertdialog');
    await expect(okayy.title).toHaveText('Danger shortcut');
  });

  test('confirm.warning() sets warning variant', async ({ okayy }) => {
    await okayy.trigger('shortcut-warning');
    await expect(okayy.dialog).toHaveAttribute('data-variant', 'warning');
    await expect(okayy.dialog).toHaveAttribute('role', 'alertdialog');
    await expect(okayy.title).toHaveText('Warning shortcut');
  });

  test('confirm.info() sets info variant', async ({ okayy }) => {
    await okayy.trigger('shortcut-info');
    await expect(okayy.dialog).toHaveAttribute('data-variant', 'info');
    await expect(okayy.dialog).toHaveAttribute('role', 'dialog');
    await expect(okayy.title).toHaveText('Info shortcut');
  });

  test('confirm.success() sets success variant', async ({ okayy }) => {
    await okayy.trigger('shortcut-success');
    await expect(okayy.dialog).toHaveAttribute('data-variant', 'success');
    await expect(okayy.dialog).toHaveAttribute('role', 'dialog');
    await expect(okayy.title).toHaveText('Success shortcut');
  });
});
