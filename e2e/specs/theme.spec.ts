import { test, expect } from '../fixtures/okayy.fixture';

test.describe('Theme - Light', () => {
  test.use({ colorScheme: 'light' });

  test('no .dark class on [data-okayy] in light mode', async ({ okayy }) => {
    await okayy.trigger('basic');
    await expect(okayy.root).not.toHaveClass(/dark/);
  });
});

test.describe('Theme - Dark', () => {
  test.use({ colorScheme: 'dark' });

  test('.dark class present on [data-okayy] in dark mode', async ({ okayy }) => {
    await okayy.trigger('basic');
    await expect(okayy.root).toHaveClass(/dark/);
  });
});

test.describe('Theme - System preference', () => {
  test.use({ colorScheme: 'dark' });

  test('system dark preference adds .dark class', async ({ okayy }) => {
    await okayy.trigger('basic');
    await expect(okayy.root).toHaveClass(/dark/);
    await expect(okayy.dialog).toBeVisible();
  });
});
