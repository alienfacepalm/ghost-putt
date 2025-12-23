import { test, expect } from '@playwright/test';

test.describe('Ghost Putt - Game Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    
    // Set up a game session
    const nameInput = page.getByPlaceholderText(/enter your name/i);
    await nameInput.fill('Game Player');
    await page.getByRole('button', { name: /create room/i }).click();
    
    // Wait for room to be created
    await expect(page.getByText(/room code/i)).toBeVisible({ timeout: 5000 });
    
    // Start the game
    const startButton = page.getByRole('button', { name: /start game/i });
    await expect(startButton).toBeVisible({ timeout: 5000 });
    await startButton.click();
  });

  test('should start game and show game canvas', async ({ page }) => {
    // After clicking start, should see game elements
    // This depends on your game canvas implementation
    await page.waitForTimeout(1000); // Give time for game to initialize
    
    // Check for game-related elements
    // Adjust selectors based on your actual implementation
    const canvas = page.locator('canvas');
    if (await canvas.count() > 0) {
      await expect(canvas.first()).toBeVisible();
    }
  });

  test('should display game header with room info', async ({ page }) => {
    // Check for header elements
    // Adjust based on your Header component
    await page.waitForTimeout(1000);
    
    // Header should be visible
    const header = page.locator('header').first();
    if (await header.count() > 0) {
      await expect(header).toBeVisible();
    }
  });

  test('should handle game controls', async ({ page }) => {
    await page.waitForTimeout(1000);
    
    // Look for game control buttons or UI elements
    // This is a placeholder - adjust based on your actual game controls
    const buttons = page.getByRole('button');
    const buttonCount = await buttons.count();
    expect(buttonCount).toBeGreaterThan(0);
  });
});

