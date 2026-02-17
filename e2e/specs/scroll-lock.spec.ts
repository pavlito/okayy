import { test, expect } from '../fixtures/okayy.fixture';

test.describe('Scroll Lock', () => {
  test('body overflow is hidden when dialog is open', async ({ okayy }) => {
    await okayy.page.locator('[data-testid="tall-content"]').waitFor();

    // Body should be scrollable before dialog opens
    const overflowBefore = await okayy.page.evaluate(() => document.body.style.overflow);
    expect(overflowBefore).not.toBe('hidden');

    await okayy.trigger('scroll-lock');

    // Body overflow should be hidden while dialog is open
    const overflowDuring = await okayy.page.evaluate(() => document.body.style.overflow);
    expect(overflowDuring).toBe('hidden');
  });

  test('body overflow is restored after dialog closes', async ({ okayy }) => {
    await okayy.page.locator('[data-testid="tall-content"]').waitFor();

    await okayy.trigger('scroll-lock');
    await okayy.confirm();
    await okayy.waitForClose();

    // Overflow should be restored
    const overflowAfter = await okayy.page.evaluate(() => document.body.style.overflow);
    expect(overflowAfter).not.toBe('hidden');
  });

  test('mouse wheel does not scroll page while dialog is open', async ({ okayy }) => {
    const isMobile = await okayy.page.evaluate(() => 'ontouchstart' in window);
    test.skip(isMobile, 'mouse.wheel not supported on mobile');
    await okayy.page.locator('[data-testid="tall-content"]').waitFor();

    // Scroll down first
    await okayy.page.evaluate(() => window.scrollTo(0, 200));
    await okayy.page.waitForFunction(() => window.scrollY > 0);

    await okayy.trigger('scroll-lock');
    const scrollBefore = await okayy.page.evaluate(() => window.scrollY);

    // Try to scroll via mouse wheel — should be blocked by overflow:hidden
    await okayy.page.mouse.wheel(0, 500);
    await okayy.page.waitForTimeout(200);

    const scrollAfter = await okayy.page.evaluate(() => window.scrollY);
    expect(scrollAfter).toBe(scrollBefore);
  });

  test('scrollbar compensation prevents layout shift', async ({ okayy }) => {
    await okayy.page.locator('[data-testid="tall-content"]').waitFor();

    // Get body width before dialog
    const widthBefore = await okayy.page.evaluate(
      () => document.body.getBoundingClientRect().width,
    );

    await okayy.trigger('scroll-lock');

    // Body width should stay approximately the same (padding compensates scrollbar)
    const widthDuring = await okayy.page.evaluate(
      () => document.body.getBoundingClientRect().width,
    );
    expect(Math.abs(widthDuring - widthBefore)).toBeLessThan(2);
  });

  test('siblings are inert when dialog is open', async ({ okayy }) => {
    await okayy.trigger('scroll-lock');

    const inertCount = await okayy.page.evaluate(() => {
      return document.querySelectorAll('body > :not([data-okayy])[inert]').length;
    });
    expect(inertCount).toBeGreaterThan(0);
  });

  test('scroll lock works across queue — remains locked between dialogs', async ({ okayy }) => {
    await okayy.page.locator('[data-testid="tall-content"]').waitFor();

    // Open queue of 3 dialogs
    await okayy.page.locator('[data-testid="queue-3"]').click();
    await okayy.expectOpen();

    // Should be locked on first dialog
    const overflow1 = await okayy.page.evaluate(() => document.body.style.overflow);
    expect(overflow1).toBe('hidden');

    // Confirm first dialog — second should appear, still locked
    await okayy.confirm();
    await okayy.page.waitForTimeout(300);
    await okayy.expectOpen();
    const overflow2 = await okayy.page.evaluate(() => document.body.style.overflow);
    expect(overflow2).toBe('hidden');

    // Confirm second — third appears, still locked
    await okayy.confirm();
    await okayy.page.waitForTimeout(300);
    await okayy.expectOpen();
    const overflow3 = await okayy.page.evaluate(() => document.body.style.overflow);
    expect(overflow3).toBe('hidden');

    // Confirm third — all closed, should be unlocked
    await okayy.confirm();
    await okayy.waitForClose();
    const overflowFinal = await okayy.page.evaluate(() => document.body.style.overflow);
    expect(overflowFinal).not.toBe('hidden');
  });
});
