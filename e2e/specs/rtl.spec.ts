import { test, expect } from '../fixtures/okayy.fixture';

test.describe('RTL', () => {
  test('dir="rtl" set on portal wrapper', async ({ okayy }) => {
    await okayy.trigger('rtl');
    await expect(okayy.root).toHaveAttribute('dir', 'rtl');
  });

  test('RTL title renders correctly', async ({ okayy }) => {
    await okayy.trigger('rtl');
    await expect(okayy.title).toHaveText('RTL Test');
    await expect(okayy.root).toHaveAttribute('dir', 'rtl');
  });

  test('no dir attribute when not specified', async ({ okayy }) => {
    await okayy.trigger('basic');
    await expect(okayy.root).not.toHaveAttribute('dir');
  });
});
