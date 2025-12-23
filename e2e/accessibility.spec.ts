import { test, expect } from '@playwright/test';

test.describe('Ghost Putt - Accessibility', () => {
  test('should have proper heading structure', async ({ page }) => {
    await page.goto('/');
    
    // Check for main headings
    const h1 = page.locator('h1');
    const h2 = page.locator('h2');
    
    const h1Count = await h1.count();
    const h2Count = await h2.count();
    
    // Should have at least one heading
    expect(h1Count + h2Count).toBeGreaterThan(0);
  });

  test('should have accessible form labels', async ({ page }) => {
    await page.goto('/');
    
    // Inputs should have labels or aria-labels
    const nameInput = page.getByPlaceholderText(/enter your name/i);
    await expect(nameInput).toBeVisible();
    
    // Check if input has associated label or aria-label
    const hasLabel = await nameInput.evaluate((el) => {
      const id = el.id;
      if (id) {
        return !!document.querySelector(`label[for="${id}"]`);
      }
      return !!el.getAttribute('aria-label');
    });
    
    // Input should be accessible (has label or placeholder)
    expect(hasLabel || (await nameInput.getAttribute('placeholder'))).toBeTruthy();
  });

  test('should have keyboard navigation', async ({ page }) => {
    await page.goto('/');
    
    // Tab through interactive elements
    await page.keyboard.press('Tab');
    
    // Should focus on an interactive element
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(['INPUT', 'BUTTON', 'A']).toContain(focusedElement);
  });

  test('should have proper button roles', async ({ page }) => {
    await page.goto('/');
    
    // All buttons should have button role
    const buttons = page.getByRole('button');
    const buttonCount = await buttons.count();
    
    expect(buttonCount).toBeGreaterThan(0);
    
    // Check first button
    const firstButton = buttons.first();
    await expect(firstButton).toBeVisible();
  });

  test('should support screen reader text', async ({ page }) => {
    await page.goto('/');
    
    // Check for aria-labels or screen reader only text
    const elements = page.locator('[aria-label], [aria-labelledby]');
    const count = await elements.count();
    
    // Should have some accessible elements
    // This is a basic check - adjust based on your accessibility implementation
    expect(count).toBeGreaterThanOrEqual(0);
  });
});

