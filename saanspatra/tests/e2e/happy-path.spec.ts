import { test, expect } from '@playwright/test';

test.describe('SaansPatra Core Flow', () => {
  test('loads home page and displays masthead', async ({ page }) => {
    await page.goto('/');

    // Check header masthead
    await expect(page.locator('h1')).toContainText('SaansPatra');
    await expect(page.getByText('Civic Air Quality Briefing Studio')).toBeVisible();

    // Check Data Desk pane
    await expect(page.getByText('Pane 1: Data Desk')).toBeVisible();
    await expect(page.getByRole('button', { name: /Load Demo Dataset/i })).toBeVisible();
  });

  test('loads demo dataset and generates briefing note', async ({ page }) => {
    await page.goto('/');

    // Click Load Demo Dataset
    await page.getByRole('button', { name: /Load Demo Dataset/i }).click();

    // Select Delhi demo data
    await page.getByText('1. Delhi NCR Multi-Station').click();

    // Wait for analysis and briefing to complete
    await expect(page.getByText('Active Dataset:')).toBeVisible();
    await expect(page.getByText('Cleaned Data Preview')).toBeVisible();

    // Verify Briefing note generated
    await expect(page.getByText('Air Quality Intelligence Brief')).toBeVisible();
    await expect(page.getByText('Traceable Intelligence Findings')).toBeVisible();
    await expect(page.getByText('Prioritized Action Directives')).toBeVisible();

    // Verify Evidence records generated in Pane 3
    await expect(page.getByText('Traceable Evidence Logs')).toBeVisible();
    await expect(page.locator('#evidence-E1')).toBeVisible();
  });

  test('switches persona and recalculates tailored actions', async ({ page }) => {
    await page.goto('/');

    // Load demo data
    await page.getByRole('button', { name: /Load Demo Dataset/i }).click();
    await page.getByText('1. Delhi NCR Multi-Station').click();
    await expect(page.getByText('Air Quality Intelligence Brief')).toBeVisible();

    // Switch to School Administration
    await page.getByLabel('School Administration').check();

    // Verify school specific role title
    await expect(page.getByText('School Leadership & Student Welfare')).toBeVisible();
  });

  test('switches to Citizen Advisory with multi-language and reading levels', async ({ page }) => {
    await page.goto('/');

    // Load demo data
    await page.getByRole('button', { name: /Load Demo Dataset/i }).click();
    await page.getByText('1. Delhi NCR Multi-Station').click();
    await expect(page.getByText('Air Quality Intelligence Brief')).toBeVisible();

    // Switch to Citizen Advisory sub-tab
    await page.getByRole('tab', { name: 'Citizen Advisory' }).click();

    // Verify citizen advisory view
    await expect(page.getByText('Citizen Public Health Advisory')).toBeVisible();
    await expect(page.getByText('Special Care Guidance for High-Risk Groups')).toBeVisible();
    await expect(page.getByText('Children & School Students')).toBeVisible();
    await expect(page.getByText('Senior Citizens (60+)')).toBeVisible();
    await expect(page.getByText('Asthma & Respiratory Patients')).toBeVisible();

    // Verify copy button and disclaimer
    await expect(page.getByText('Copy for WhatsApp')).toBeVisible();
    await expect(page.getByText('Notice: Not Medical Advice')).toBeVisible();
  });
});
