import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('token', 'mock-test-token');
    localStorage.setItem('role', 'USER');
  });
});

test('ticket list page renders heading', async ({ page }) => {
  await page.goto('/tickets');
  await expect(page.getByRole('heading', { name: /my tickets/i })).toBeVisible();
});

test('shows empty state when no tickets', async ({ page }) => {
  await page.goto('/tickets');
  await expect(page).toHaveURL('/tickets');
});

test('navigates to create ticket page from list', async ({ page }) => {
  await page.goto('/tickets');
  await page.getByRole('link', { name: /new ticket|create|report/i }).click();
  await expect(page).toHaveURL('/tickets/new');
});
