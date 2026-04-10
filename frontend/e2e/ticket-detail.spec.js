import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('token', 'mock-test-token');
    localStorage.setItem('role', 'USER');
  });
});

test('shows not found message for invalid ticket ID', async ({ page }) => {
  await page.goto('/tickets/nonexistentid000');
  await expect(page.getByText(/not found|ticket not found/i)).toBeVisible();
});

test('status badge is visible on ticket detail', async ({ page }) => {
  await page.route('**/api/v1/tickets/test-id', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 'test-id', title: 'Broken Projector', status: 'OPEN',
        priority: 'HIGH', category: 'IT_EQUIPMENT', location: 'Lab 3',
        description: 'Projector not turning on', reportedByEmail: 'user@test.com',
        createdAt: new Date().toISOString(), attachmentUrls: [], comments: []
      })
    })
  );
  await page.goto('/tickets/test-id');
  await expect(page.getByTestId('status-badge')).toBeVisible();
  await expect(page.getByText('Broken Projector')).toBeVisible();
});
