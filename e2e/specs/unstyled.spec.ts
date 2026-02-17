import { test, expect } from '../fixtures/okayy.fixture';

test.describe('Unstyled', () => {
  test('unstyled dialog has data-unstyled attribute', async ({ okayy }) => {
    await okayy.trigger('unstyled');
    await expect(okayy.root).toHaveAttribute('data-unstyled', 'true');
  });

  test('unstyled dialog has no background', async ({ okayy }) => {
    await okayy.trigger('unstyled');
    const bg = await okayy.dialog.evaluate((el) => getComputedStyle(el).background);
    // "none" or transparent — no default styling
    expect(bg).toMatch(/none|rgba\(0, 0, 0, 0\)/);
  });

  test('unstyled overlay has no background', async ({ okayy }) => {
    await okayy.trigger('unstyled');
    const bg = await okayy.overlay.evaluate((el) => getComputedStyle(el).background);
    expect(bg).toMatch(/none|rgba\(0, 0, 0, 0\)/);
  });

  test('unstyled buttons have no border', async ({ okayy }) => {
    await okayy.trigger('unstyled');
    const border = await okayy.confirmBtn.evaluate((el) => getComputedStyle(el).borderStyle);
    expect(border).toBe('none');
  });
});
