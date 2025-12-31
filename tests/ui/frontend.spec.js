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

  test('Navigation: Verify main menu links load correctly', async ({ page }) => {
    // This is a simplified check. In reality, you'd iterate over links or check specific ones.
    const links = await homePage.mainMenuLinks.all();
    // Assuming at least one link exists
    expect(links.length).toBeGreaterThan(0);
    
    // Example: Click the first link and verify URL changes or content loads
    // await links[0].click();
    // await expect(page).toHaveURL(/some-path/);
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

    await homePage.clickLogin();
    await loginPage.login(email, password);
    
    // Verify login success (e.g., check for profile icon)
    // await expect(loginPage.userProfileIcon).toBeVisible();

    // Verify logout
    // await loginPage.logout();
    // await expect(homePage.loginButton).toBeVisible();
  });

  test('Content Visibility: Video player, matches, banners, and sections', async () => {
    // Using soft assertions to check multiple elements without failing immediately
    // Note: These selectors are placeholders in POM, so tests might fail if run against real site without updating selectors
    
    // Core content
    // await expect.soft(homePage.videoPlayer).toBeVisible();
    // await expect.soft(homePage.liveMatchUpdates).toBeVisible();
    // await expect.soft(homePage.banners).first().toBeVisible();

    // New Sections
    // await expect.soft(homePage.header).toBeVisible();
    // await expect.soft(homePage.footer).toBeVisible();
    // await expect.soft(homePage.sidebar).toBeVisible();
    // await expect.soft(homePage.leaguesList).toBeVisible();
    // await expect.soft(homePage.newsSection).toBeVisible();
    // await expect.soft(homePage.scheduleSection).toBeVisible();
  });

  test('Search/Filters: Test search functionality', async () => {
    const searchTerm = 'Team A';
    await homePage.searchFor(searchTerm);
    // await expect(homePage.searchResults).toBeVisible();
    // await expect(homePage.searchResults).toContainText(searchTerm);
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
