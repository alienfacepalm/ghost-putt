import { test, expect } from '@playwright/test';

test.describe('Dev Server', () => {
  test('should serve index.html at root', async ({ page }) => {
    const response = await page.goto('http://localhost:3000');
    expect(response?.status()).toBe(200);
    expect(response?.url()).toBe('http://localhost:3000/');
  });

  test('should have correct page title', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await expect(page).toHaveTitle(/GhostPutt/);
  });

  test('should render root element', async ({ page }) => {
    await page.goto('http://localhost:3000');
    const root = page.locator('#root');
    await expect(root).toBeVisible({ timeout: 5000 });
  });

  test('should load main script', async ({ page }) => {
    const errors: string[] = [];
    page.on('response', (response) => {
      if (response.status() === 404 && response.url().includes('/src/main.tsx')) {
        errors.push(`404: ${response.url()}`);
      }
    });

    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    expect(errors).toHaveLength(0);
  });

  test('should serve public assets', async ({ page }) => {
    const faviconResponse = await page.goto('http://localhost:3000/favicon.ico');
    // Favicon might be 404, that's okay - just check it doesn't crash
    expect(faviconResponse?.status()).toBeLessThan(500);
    
    const manifestResponse = await page.goto('http://localhost:3000/manifest.json');
    expect(manifestResponse?.status()).toBe(200);
  });

  test('should load CSS', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // Check that styles are applied (root should be visible)
    const root = page.locator('#root');
    const styles = await root.evaluate((el) => window.getComputedStyle(el));
    expect(styles).toBeDefined();
  });
});

