import { test, expect } from '../fixtures/okayy.fixture';

test.describe('Keyboard', () => {
  test('escape closes dialog', async ({ okayy }) => {
    await okayy.trigger('basic');
    await okayy.pressEscape();
    await okayy.waitForClose();
  });

  test('escape does not close when dismissible is false', async ({ okayy }) => {
    await okayy.trigger('non-dismissible');
    await okayy.pressEscape();
    // Dialog should remain open
    await okayy.expectOpen();
    // Clean up: close via confirm button
    await okayy.confirm();
    await okayy.waitForClose();
  });

  test('enter on confirm button confirms', async ({ okayy }) => {
    await okayy.trigger('basic');
    // Focus confirm button directly
    await okayy.confirmBtn.focus();
    await expect(okayy.confirmBtn).toBeFocused();
    // Press Enter to confirm
    await okayy.page.keyboard.press('Enter');
    await okayy.waitForClose();
  });

  test('tab order: cancel first, then confirm', async ({ okayy }, testInfo) => {
    test.skip(
      testInfo.project.name.includes('webkit') || testInfo.project.name.includes('mobile-safari'),
      'WebKit Tab behavior differs',
    );
    await okayy.trigger('basic');
    // Cancel button gets initial focus
    await expect(okayy.cancelBtn).toBeFocused();
    // Tab moves to confirm
    await okayy.page.keyboard.press('Tab');
    await expect(okayy.confirmBtn).toBeFocused();
  });
});
