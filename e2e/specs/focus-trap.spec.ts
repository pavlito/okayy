import { test, expect } from '../fixtures/okayy.fixture';

test.describe('Focus Trap', () => {
  test('focus moves into dialog on open', async ({ okayy }) => {
    await okayy.trigger('basic');
    // Cancel button receives initial focus (via requestAnimationFrame)
    await expect(okayy.cancelBtn).toBeFocused();
  });

  test('tab cycles within dialog', async ({ okayy }, testInfo) => {
    // WebKit doesn't allow Tab to move focus between buttons by default
    test.skip(
      testInfo.project.name.includes('webkit') || testInfo.project.name.includes('mobile-safari'),
      'WebKit Tab behavior differs',
    );
    await okayy.trigger('basic');
    await expect(okayy.cancelBtn).toBeFocused();

    // Tab from cancel to confirm
    await okayy.page.keyboard.press('Tab');
    await expect(okayy.confirmBtn).toBeFocused();

    // Tab from confirm wraps back to cancel
    await okayy.page.keyboard.press('Tab');
    await expect(okayy.cancelBtn).toBeFocused();
  });

  test('shift+tab reverse cycles', async ({ okayy }, testInfo) => {
    test.skip(
      testInfo.project.name.includes('webkit') || testInfo.project.name.includes('mobile-safari'),
      'WebKit Tab behavior differs',
    );
    await okayy.trigger('basic');
    await expect(okayy.cancelBtn).toBeFocused();

    // Shift+Tab from cancel wraps to confirm
    await okayy.page.keyboard.press('Shift+Tab');
    await expect(okayy.confirmBtn).toBeFocused();

    // Shift+Tab from confirm goes to cancel
    await okayy.page.keyboard.press('Shift+Tab');
    await expect(okayy.cancelBtn).toBeFocused();
  });

  test('focus returns to trigger on close', async ({ okayy }, testInfo) => {
    test.skip(
      testInfo.project.name.includes('webkit') || testInfo.project.name.includes('mobile-safari'),
      'WebKit focus restore behavior differs',
    );
    const triggerBtn = okayy.page.locator('[data-testid="basic"]');
    await triggerBtn.click();
    await okayy.expectOpen();

    await okayy.cancel();
    await okayy.waitForClose();

    await expect(triggerBtn).toBeFocused();
  });

  test('siblings have inert attribute when dialog is open', async ({ okayy }) => {
    await okayy.trigger('basic');

    // Body children other than [data-okayy] should have inert
    const inertSiblings = okayy.page.locator('body > :not([data-okayy])[inert]');
    await expect(inertSiblings.first()).toBeAttached();

    // Close dialog and verify inert is removed
    await okayy.cancel();
    await okayy.waitForClose();

    const inertAfterClose = okayy.page.locator('body > [inert]');
    await expect(inertAfterClose).toHaveCount(0);
  });
});
