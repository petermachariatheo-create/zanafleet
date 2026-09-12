import { test, expect } from '@playwright/test';

const PERSONAS = [
  { name: 'Rider', role: 'rider' },
  { name: 'Fleet Manager', role: 'fleet-manager' },
  { name: 'Business Owner', role: 'business-owner' },
  { name: 'Marketplace Contractor', role: 'marketplace-contractor' },
  { name: 'System Admin', role: 'system-admin' },
] as const;

async function loginAs(page: any, personaName: string) {
  await page.getByText(personaName).click();
  await expect(page).toHaveURL('/jobs');
}

async function navigateTo(page: any, linkName: string, expectedUrl: string) {
  await page.getByText(linkName).first().click();
  await expect(page).toHaveURL(expectedUrl);
}

test.describe('ZanaFleet Product Simulator', () => {
  test.describe('Homepage', () => {
    test('should load with branding and persona cards', async ({ page }) => {
      await page.goto('/');
      await expect(page.getByText('ZanaFleet', { exact: true }).first()).toBeVisible({ timeout: 10000 });
      await expect(page.getByText('Multi-Vertical Job Orchestration Platform')).toBeVisible({ timeout: 10000 });
      await expect(page.getByText('Welcome to ZanaFleet Simulator')).toBeVisible({ timeout: 10000 });

      for (const persona of PERSONAS) {
        await expect(page.getByText(persona.name)).toBeVisible({ timeout: 10000 });
      }
    });
  });

  test.describe('Authentication', () => {
    for (const persona of PERSONAS) {
      test(`should login as ${persona.name}`, async ({ page }) => {
        await page.goto('/');
        await loginAs(page, persona.name);
      });
    }
  });

  test.describe('Navigation', () => {
    const navTests = [
      { persona: 'Fleet Manager', from: '/jobs', to: 'Dashboard', url: '/dashboard' },
      { persona: 'Fleet Manager', from: '/jobs', to: 'Contacts', url: '/contacts' },
      { persona: 'Business Owner', from: '/jobs', to: 'Dashboard', url: '/dashboard' },
      { persona: 'Business Owner', from: '/jobs', to: 'Reports', url: '/reports' },
      { persona: 'Business Owner', from: '/jobs', to: 'Billing', url: '/billing' },
      { persona: 'Rider', from: '/jobs', to: 'Wallet', url: '/wallet' },
      { persona: 'Fleet Manager', from: '/jobs', to: 'Maps', url: '/maps' },
    ];

    for (const nav of navTests) {
      test(`should navigate from ${nav.from} to ${nav.to} as ${nav.persona}`, async ({ page }) => {
        await page.goto('/');
        await loginAs(page, nav.persona);
        await navigateTo(page, nav.to, nav.url);
      });
    }
  });

  test.describe('Multi-workspace support', () => {
    test('should show workspace selector for Fleet Manager', async ({ page }) => {
      await page.goto('/');
      await loginAs(page, 'Fleet Manager');
      await expect(page.getByRole('button', { name: 'QuickBite' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'SwiftMove' })).toBeVisible();
    });

    test('should show workspace selector for Business Owner', async ({ page }) => {
      await page.goto('/');
      await loginAs(page, 'Business Owner');
      await expect(page.getByRole('button', { name: 'QuickBite' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'BulkHub' })).toBeVisible();
    });
  });

  test.describe('Multi-vertical support', () => {
    test('should show job feed for Rider (delivery)', async ({ page }) => {
      await page.goto('/');
      await loginAs(page, 'Rider');
      await expect(page.getByRole('button', { name: '📋 Jobs' })).toBeVisible();
    });

    test('should show job feed for Fleet Manager (moving)', async ({ page }) => {
      await page.goto('/');
      await loginAs(page, 'Fleet Manager');
      await expect(page.getByRole('button', { name: '📋 Jobs' })).toBeVisible();
    });
  });

  test.describe('Page content verification', () => {
    const pageTests = [
      { persona: 'Business Owner', nav: 'Dashboard', heading: 'Dashboard', url: '/dashboard' },
      { persona: 'Business Owner', nav: 'Reports', heading: 'Reports', url: '/reports' },
      { persona: 'Business Owner', nav: 'Billing', heading: 'Billing', url: '/billing' },
      { persona: 'Rider', nav: 'Wallet', heading: 'Wallet', url: '/wallet' },
      { persona: 'Fleet Manager', nav: 'Maps', heading: 'Map View', url: '/maps' },
      { persona: 'Fleet Manager', nav: 'Contacts', heading: 'Contacts', url: '/contacts' },
    ];

    for (const pt of pageTests) {
      test(`should display ${pt.heading} page for ${pt.persona}`, async ({ page }) => {
        await page.goto('/');
        await loginAs(page, pt.persona);
        await navigateTo(page, pt.nav, pt.url);
        await expect(page.getByText(pt.heading).first()).toBeVisible({ timeout: 10000 });
      });
    }

    test('should show Balance on Wallet page', async ({ page }) => {
      await page.goto('/');
      await loginAs(page, 'Rider');
      await navigateTo(page, 'Wallet', '/wallet');
      await expect(page.getByText('Balance')).toBeVisible();
    });
  });

  test.describe('Error handling', () => {
    test('should show NotFound page for invalid routes', async ({ page }) => {
      await page.goto('/non-existent-route-12345');
      await expect(page.getByText('Not Found').or(page.getByText('404'))).toBeVisible({ timeout: 10000 });
    });
  });
});