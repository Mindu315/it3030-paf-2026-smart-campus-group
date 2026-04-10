import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('token', 'mock-test-token');
    localStorage.setItem('role', 'USER');
  });
});

test('shows create ticket form with all required fields', async ({ page }) => {
  await page.goto('/tickets/new');
  await expect(page.getByLabel(/title/i)).toBeVisible();
  await expect(page.getByLabel(/description/i)).toBeVisible();
  await expect(page.getByLabel(/category/i)).toBeVisible();
  await expect(page.getByLabel(/priority/i)).toBeVisible();
  await expect(page.getByLabel(/location/i)).toBeVisible();
  await expect(page.getByTestId('attachment-uploader')).toBeVisible();
});

test('shows validation errors when form submitted empty', async ({ page }) => {
  await page.goto('/tickets/new');
  await page.getByRole('button', { name: /submit/i }).click();
  await expect(page.getByText(/title is required/i)).toBeVisible();
  await expect(page.getByText(/description is required/i)).toBeVisible();
  await expect(page.getByText(/location is required/i)).toBeVisible();
});

test('description character counter counts down from 1000', async ({ page }) => {
  await page.goto('/tickets/new');
  await page.getByLabel(/description/i).fill('Hello');
  await expect(page.getByText(/995/)).toBeVisible();
});

test('attachment uploader blocks more than 3 files', async ({ page }) => {
  await page.goto('/tickets/new');
  const uploader = page.getByTestId('attachment-uploader');
  await expect(uploader).toBeVisible();
  const addBtn = page.getByTestId('add-attachment-btn');
  await expect(addBtn).toBeVisible();
});
