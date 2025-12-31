class BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
  }

  async navigateTo(path = '/') {
    await this.page.goto(path);
  }

  async getTitle() {
    return await this.page.title();
  }

  async wait(ms) {
    await this.page.waitForTimeout(ms);
  }
}

module.exports = BasePage;
