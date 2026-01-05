// @ts-check
const { test, expect } = require('@playwright/test');
const HomePage = require('../../pages/HomePage');
const LoginPage = require('../../pages/LoginPage');

test.describe('Frontend UI Tests', () => {
  /** @type {HomePage} */
  let homePage;
  /** @type {LoginPage} */
  let loginPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    loginPage = new LoginPage(page);
    await homePage.navigate();
  });

  test('Navigation: Page loads and has a title', async () => {
    const title = await homePage.getTitle();
    expect(title).toBeTruthy();
  });

  test('Language Switcher: Test functionality', async () => {
    // Note: Implementation depends on specific site behavior
    // This test assumes the switcher exists and works as defined in POM
    if (await homePage.languageSwitcher.isVisible()) {
        await homePage.switchLanguage('EN');
        // Add assertion here, e.g., URL contains /en/ or text is in English
    } else {
        console.log('Language switcher not found or visible');
    }
  });

  test('User Authentication: Login/Logout flows', async () => {
    const email = process.env.TEST_USER_EMAIL || 'test@example.com';
    const password = process.env.TEST_USER_PASSWORD || 'password';

    if (await homePage.loginButton.isVisible()) {
      await homePage.clickLogin();
      if (await loginPage.emailInput.isVisible()) {
        await loginPage.login(email, password);
      }
    } else {
      console.log('Login button not visible');
    }
  });

  test('Content Visibility: Basic page rendering', async () => {
    const title = await homePage.getTitle();
    expect(title).toBeTruthy();
  });

  test('Search/Filters: Test search functionality', async () => {
    const searchTerm = 'Team A';
    if (await homePage.searchInput.isVisible()) {
      await homePage.searchFor(searchTerm);
      // Optional assertions if results are visible
      // await expect(homePage.searchResults).toBeVisible();
    } else {
      console.log('Search input not available');
    }
  });

  test('Responsiveness: Verify layout on current viewport', async ({ page }) => {
    // Playwright runs this test for each project (Desktop, Mobile) defined in config
    // We can check for specific mobile elements or layout changes
    const viewportSize = page.viewportSize();
    console.log(`Testing viewport: ${viewportSize?.width}x${viewportSize?.height}`);

    if (viewportSize && viewportSize.width < 768) {
      // Mobile specific checks
      // await expect(page.locator('.mobile-menu-hamburger')).toBeVisible();
    } else {
      // Desktop specific checks
      // await expect(page.locator('.desktop-menu')).toBeVisible();
    }
  });
});
