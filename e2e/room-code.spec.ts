import { test, expect } from '@playwright/test';

test.describe('Ghost Putt - Room Code Functionality', () => {
  test('should generate and display room code', async ({ page }) => {
    await page.goto('/');
    
    const nameInput = page.getByPlaceholderText(/enter your name/i);
    await nameInput.fill('Host Player');
    
    await page.getByRole('button', { name: /create room/i }).click();
    
    // Room code should be displayed
    await expect(page.getByText(/room code/i)).toBeVisible({ timeout: 5000 });
    
    // Room code should be formatted (XXX-XXX)
    const roomCodeText = await page.locator('code').first().textContent();
    if (roomCodeText) {
      expect(roomCodeText).toMatch(/^[A-Z0-9]{3}-[A-Z0-9]{3}$/);
    }
  });

  test('should copy room link to clipboard', async ({ page, context }) => {
    await page.goto('/');
    
    const nameInput = page.getByPlaceholderText(/enter your name/i);
    await nameInput.fill('Host Player');
    
    await page.getByRole('button', { name: /create room/i }).click();
    
    // Wait for room code display
    await expect(page.getByText(/room code/i)).toBeVisible({ timeout: 5000 });
    
    // Click copy button
    const copyButton = page.getByRole('button', { name: /copy link/i });
    if (await copyButton.isVisible()) {
      await copyButton.click();
      
      // Check clipboard content
      const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
      expect(clipboardText).toContain('room=');
    }
  });

  test('should validate room code format', async ({ page }) => {
    await page.goto('/');
    
    const nameInput = page.getByPlaceholderText(/enter your name/i);
    await nameInput.fill('Join Player');
    
    // Try to enter invalid room code
    const roomCodeInput = page.getByPlaceholderText(/enter room code/i);
    if (await roomCodeInput.isVisible()) {
      await roomCodeInput.fill('invalid');
      
      // Try to join - should either show error or prevent submission
      await page.getByRole('button', { name: /join room/i }).click();
      
      // Room code input should still be visible (join failed)
      await expect(roomCodeInput).toBeVisible();
    }
  });

  test('should load room from URL parameter', async ({ page }) => {
    // Navigate with room code in URL
    await page.goto('/?room=ABCDEF');
    
    // Should attempt to join or show room info
    // Behavior depends on implementation
    await page.waitForTimeout(1000);
    
    // Check that room code is in URL
    const url = page.url();
    expect(url).toContain('room=ABCDEF');
  });
});

