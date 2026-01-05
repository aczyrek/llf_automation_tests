class BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
  }

  async navigateTo(path = '/') {
    return await this.page.goto(path, { waitUntil: 'domcontentloaded' });
  }

  async getTitle() {
    return await this.page.title();
  }

  async wait(ms) {
    await this.page.waitForTimeout(ms);
  }
}

module.exports = BasePage;
