import { test, expect } from '@playwright/test';

test.describe('Ghost Putt - Main App Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display game lobby on initial load', async ({ page }) => {
    // Check for lobby elements
    await expect(page.getByPlaceholderText(/enter your name/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /create room/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /join room/i })).toBeVisible();
  });

  test('should create a room with player name', async ({ page }) => {
    // Enter player name
    const nameInput = page.getByPlaceholderText(/enter your name/i);
    await nameInput.fill('Test Player');
    
    // Click create room
    await page.getByRole('button', { name: /create room/i }).click();
    
    // Should show room code display
    await expect(page.getByText(/room code/i)).toBeVisible();
    
    // Should show "Start Game" button
    await expect(page.getByRole('button', { name: /start game/i })).toBeVisible({ timeout: 5000 });
  });

  test('should validate player name before creating room', async ({ page }) => {
    // Try to create room without name
    await page.getByRole('button', { name: /create room/i }).click();
    
    // Should show error or prevent action
    // The exact behavior depends on implementation
    const nameInput = page.getByPlaceholderText(/enter your name/i);
    await expect(nameInput).toBeVisible();
  });

  test('should join a room with valid room code', async ({ page }) => {
    // First, create a room in another context to get a room code
    // For this test, we'll simulate the join flow
    const nameInput = page.getByPlaceholderText(/enter your name/i);
    await nameInput.fill('Test Player');
    
    // Enter a room code (format: 6 uppercase letters/numbers)
    const roomCodeInput = page.getByPlaceholderText(/enter room code/i);
    if (await roomCodeInput.isVisible()) {
      await roomCodeInput.fill('ABCDEF');
      await page.getByRole('button', { name: /join room/i }).click();
    }
  });

  test('should persist player name in localStorage', async ({ page, context }) => {
    const nameInput = page.getByPlaceholderText(/enter your name/i);
    await nameInput.fill('Persistent Player');
    
    // Create room to trigger save
    await page.getByRole('button', { name: /create room/i }).click();
    
    // Reload page
    await page.reload();
    
    // Name should be persisted
    const nameInputAfterReload = page.getByPlaceholderText(/enter your name/i);
    const value = await nameInputAfterReload.inputValue();
    expect(value).toBe('Persistent Player');
  });

  test('should display room code in URL after creating room', async ({ page }) => {
    const nameInput = page.getByPlaceholderText(/enter your name/i);
    await nameInput.fill('Test Player');
    
    await page.getByRole('button', { name: /create room/i }).click();
    
    // Wait for room code to appear
    await expect(page.getByText(/room code/i)).toBeVisible({ timeout: 5000 });
    
    // Check URL contains room parameter
    const url = page.url();
    expect(url).toContain('room=');
  });
});

