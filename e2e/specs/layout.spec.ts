import { test, expect } from '../fixtures/okayy.fixture';

test.describe('Layout', () => {
  test('centered layout has data-layout="centered"', async ({ okayy }) => {
    await okayy.trigger('centered');
    await expect(okayy.dialog).toHaveAttribute('data-layout', 'centered');
  });

  test('centered layout centers content', async ({ okayy }) => {
    await okayy.trigger('centered');
    const content = okayy.page.locator('[data-okayy-content]');
    const textAlign = await content.evaluate((el) => getComputedStyle(el).textAlign);
    expect(textAlign).toBe('center');
  });

  test('centered layout centers footer', async ({ okayy }) => {
    await okayy.trigger('centered');
    const footer = okayy.page.locator('[data-okayy-footer]');
    const justifyContent = await footer.evaluate((el) => getComputedStyle(el).justifyContent);
    expect(justifyContent).toBe('center');
  });

  test('default layout has data-layout="default"', async ({ okayy }) => {
    await okayy.trigger('basic');
    await expect(okayy.dialog).toHaveAttribute('data-layout', 'default');
  });
});
