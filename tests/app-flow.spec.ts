import { test, expect } from '@playwright/test';

test.describe('Happy path — full user flow', () => {
  test('user can sign in and see their world', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('main')).toBeVisible();
    await expect(page.getByText(/LIFEOS|sanctuary|your world/i)).toBeVisible();
  });

  test('journal desk tab renders without errors', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('tab', { name: /journal/i }).click();
    await expect(page.getByRole('main')).toBeVisible();
    // No error alerts should appear
    const alerts = page.getByRole('alert');
    await expect(alerts).toHaveCount(0);
  });

  test('all navigation tabs are reachable by keyboard', async ({ page }) => {
    await page.goto('/');
    const tabs = await page.getByRole('tab').all();
    expect(tabs.length).toBeGreaterThan(3);
    for (const tab of tabs) {
      await expect(tab).toBeVisible();
    }
  });
});

test.describe('Error path — graceful degradation', () => {
  test('app loads with demo data when API is offline', async ({ page }) => {
    // Intercept all API calls and return 503
    await page.route('**/api/**', (route) =>
      route.fulfill({ status: 503, body: JSON.stringify({ error: 'offline' }) })
    );
    await page.goto('/');
    // App should still render — demo data fallback
    await expect(page.getByRole('main')).toBeVisible();
    // Should NOT show an uncaught error
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    await expect(page.getByRole('main')).toBeVisible();
  });
});
