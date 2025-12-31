const BasePage = require('./BasePage');

class HomePage extends BasePage {
  constructor(page) {
    super(page);
    
    // Selectors
    this.mainMenuLinks = page.locator('nav a'); // Generic nav links
    this.languageSwitcher = page.locator('button[aria-label="Language"]'); // Hypothethical
    this.languageOptions = page.locator('.language-option');
    this.loginButton = page.locator('a[href*="login"]');
    this.videoPlayer = page.locator('.video-player-container'); // Placeholder class
    this.liveMatchUpdates = page.locator('.live-match-updates'); // Placeholder class
    this.banners = page.locator('.banner'); // Placeholder class
    this.searchInput = page.locator('input[type="search"]');
    this.searchResults = page.locator('.search-results');

    // New Sections
    this.header = page.locator('header, .header'); // Main Header
    this.footer = page.locator('footer, .footer'); // Main Footer
    this.sidebar = page.locator('aside, .sidebar'); // Sidebar (often for leagues)
    this.leaguesList = page.locator('.leagues-list, .competitions-list'); // List of competitions
    this.newsSection = page.locator('.news-section, .articles'); // News/Articles section
    this.scheduleSection = page.locator('.schedule, .upcoming-matches'); // Schedule section
    this.socialMediaLinks = page.locator('.social-links a, footer a[href*="facebook"], footer a[href*="twitter"]');
  }

  async navigate() {
    await super.navigateTo('/lt/home');
  }

  async clickLogin() {
    await this.loginButton.click();
  }

  async switchLanguage(langCode) {
    await this.languageSwitcher.click();
    await this.languageOptions.filter({ hasText: langCode }).click();
  }

  async searchFor(term) {
    await this.searchInput.fill(term);
    await this.searchInput.press('Enter');
  }

  async isVideoPlayerVisible() {
    return await this.videoPlayer.isVisible();
  }
}

module.exports = HomePage;
