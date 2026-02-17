import { test as base, expect, type Page, type Locator } from '@playwright/test';

export class OkayyDialog {
  readonly page: Page;
  readonly root: Locator;
  readonly dialog: Locator;
  readonly overlay: Locator;
  readonly confirmBtn: Locator;
  readonly cancelBtn: Locator;
  readonly title: Locator;
  readonly description: Locator;
  readonly keywordInput: Locator;
  readonly spinner: Locator;

  constructor(page: Page) {
    this.page = page;
    this.root = page.locator('[data-okayy]');
    this.dialog = page.locator('[data-okayy-dialog]');
    this.overlay = page.locator('[data-okayy-overlay]');
    this.confirmBtn = page.locator('[data-okayy-confirm]');
    this.cancelBtn = page.locator('[data-okayy-cancel]');
    this.title = page.locator('[data-okayy-title]');
    this.description = page.locator('[data-okayy-description]');
    this.keywordInput = page.locator('[data-okayy-keyword-input]');
    this.spinner = page.locator('[data-okayy-spinner]');
  }

  async expectOpen() {
    await expect(this.dialog).toBeVisible();
  }

  async expectClosed() {
    await expect(this.dialog).not.toBeVisible();
  }

  async confirm() {
    await this.confirmBtn.click();
  }

  async cancel() {
    await this.cancelBtn.click();
  }

  async pressEscape() {
    await this.page.keyboard.press('Escape');
  }

  async clickOverlay() {
    await this.overlay.click({ position: { x: 5, y: 5 } });
  }

  async waitForClose() {
    await expect(this.dialog).not.toBeVisible();
  }

  async trigger(testId: string) {
    await this.page.locator(`[data-testid="${testId}"]`).click();
    await this.expectOpen();
  }
}

export const test = base.extend<{ okayy: OkayyDialog }>({
  okayy: async ({ page }, use) => {
    await page.goto('/e2e-harness');
    await use(new OkayyDialog(page));
  },
});

export { expect };
