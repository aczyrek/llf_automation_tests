const BasePage = require('./BasePage');

class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Selectors
    this.emailInput = page.locator('input[name="email"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.submitButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator('.error-message');
    this.userProfileIcon = page.locator('.user-profile-icon');
    this.logoutButton = page.locator('button:has-text("Logout")');
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async logout() {
    await this.userProfileIcon.click();
    await this.logoutButton.click();
  }

  async isLoggedIn() {
    return await this.userProfileIcon.isVisible();
  }
}

module.exports = LoginPage;
