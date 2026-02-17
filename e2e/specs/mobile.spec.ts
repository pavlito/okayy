import { test, expect } from '../fixtures/okayy.fixture';

test.describe('Mobile', () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(!testInfo.project.name.includes('mobile'), 'Mobile only');
  });

  test('dialog renders as bottom sheet', async ({ okayy }) => {
    await okayy.trigger('basic');

    const dialogBox = await okayy.dialog.boundingBox();
    const viewport = okayy.page.viewportSize()!;
    expect(dialogBox).toBeTruthy();
    // Bottom sheet: dialog bottom edge should be near the viewport bottom
    expect(dialogBox!.y + dialogBox!.height).toBeGreaterThan(viewport.height - 10);
  });

  test('touch target height >= 44px on buttons', async ({ okayy }) => {
    await okayy.trigger('basic');

    const confirmBox = await okayy.confirmBtn.boundingBox();
    const cancelBox = await okayy.cancelBtn.boundingBox();
    expect(confirmBox).toBeTruthy();
    expect(cancelBox).toBeTruthy();
    expect(confirmBox!.height).toBeGreaterThanOrEqual(44);
    expect(cancelBox!.height).toBeGreaterThanOrEqual(44);
  });

  test('full-width buttons', async ({ okayy }) => {
    await okayy.trigger('basic');

    const dialogBox = await okayy.dialog.boundingBox();
    const confirmBox = await okayy.confirmBtn.boundingBox();
    expect(dialogBox).toBeTruthy();
    expect(confirmBox).toBeTruthy();
    // Buttons should be nearly full dialog width (accounting for padding)
    expect(confirmBox!.width).toBeGreaterThan(dialogBox!.width * 0.8);
  });

  test('overlay covers full viewport', async ({ okayy }) => {
    await okayy.trigger('basic');

    const overlayBox = await okayy.overlay.boundingBox();
    const viewport = okayy.page.viewportSize()!;
    expect(overlayBox).toBeTruthy();
    expect(overlayBox!.width).toBeGreaterThanOrEqual(viewport.width);
    expect(overlayBox!.height).toBeGreaterThanOrEqual(viewport.height);
  });
});
