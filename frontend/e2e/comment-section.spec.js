import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('token', 'mock-test-token');
    localStorage.setItem('role', 'USER');
    localStorage.setItem('userId', 'user-123');
  });

  await page.route('**/api/v1/tickets/test-id', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 'test-id', title: 'Broken Projector', status: 'OPEN',
        priority: 'HIGH', category: 'IT_EQUIPMENT', location: 'Lab 3',
        description: 'Projector not turning on', reportedByEmail: 'user@test.com',
        createdAt: new Date().toISOString(), attachmentUrls: []
      })
    })
  );

  await page.route('**/api/v1/tickets/test-id/comments', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([])
    })
  );
});

test('comment textarea is visible on ticket detail page', async ({ page }) => {
  await page.goto('/tickets/test-id');
  await expect(page.getByPlaceholder(/add a comment/i)).toBeVisible();
});

test('submit comment button is present', async ({ page }) => {
  await page.goto('/tickets/test-id');
  await expect(page.getByRole('button', { name: /post|submit comment/i })).toBeVisible();
});
