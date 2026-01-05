const { test, expect } = require('@playwright/test');
const HomePage = require('../../pages/HomePage');

test.describe('UI Healthcheck', () => {
  test('Responds and has a title', async ({ page }) => {
    const home = new HomePage(page);
    const response = await home.navigate();
    if (response) {
      expect([200, 301, 302, 303, 304]).toContain(response.status());
    }
    const title = await home.getTitle();
    expect(title).toBeTruthy();
  });
});