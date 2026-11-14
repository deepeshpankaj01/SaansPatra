import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test.describe('WCAG 2.2 AA Accessibility Audits', () => {
  test('home page passes automated accessibility checks', async ({ page }) => {
    await page.goto('/');
    await injectAxe(page);

    // Run axe check with WCAG 2.2 AA rules
    await checkA11y(page, undefined, {
      axeOptions: {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag22aa'],
        },
      },
      detailedReport: true,
      detailedReportOptions: { html: true },
    });
  });

  test('briefing and advisory views pass accessibility checks', async ({ page }) => {
    await page.goto('/');

    // Load demo data
    await page.getByRole('button', { name: /Load Demo Dataset/i }).click();
    await page.getByText('1. Delhi NCR Multi-Station').click();
    await expect(page.getByText('Air Quality Intelligence Brief')).toBeVisible();

    await injectAxe(page);

    // Check accessibility of active briefing
    await checkA11y(page, undefined, {
      axeOptions: {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa'],
        },
      },
    });

    // Switch to Citizen Advisory
    await page.getByRole('tab', { name: 'Citizen Advisory' }).click();
    await expect(page.getByText('Citizen Public Health Advisory')).toBeVisible();

    // Re-check accessibility of Citizen Advisory
    await checkA11y(page, undefined, {
      axeOptions: {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa'],
        },
      },
    });
  });
});
