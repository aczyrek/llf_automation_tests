// @ts-check
const { test, expect } = require('@playwright/test');

const API_BASE_URL = process.env.API_BASE_URL || 'https://online.futbolas.tv/api/v1';

test.describe('Backend API Tests', () => {

  test('Endpoint Validation: Fetch match list', async ({ request }) => {
    // Placeholder endpoint: /matches
    const response = await request.get(`${API_BASE_URL}/matches`);
    
    // Validate status code
    expect(response.status()).toBe(200);

    // Schema Validation
    const body = await response.json();
    // Assuming body is an array of matches or has a 'data' property
    const matches = Array.isArray(body) ? body : body.data || [];
    
    // Check if we received data (optional, depends on test environment)
    // expect(matches.length).toBeGreaterThan(0);

    if (matches.length > 0) {
      const firstMatch = matches[0];
      expect(firstMatch).toHaveProperty('id');
      expect(firstMatch).toHaveProperty('title');
      expect(firstMatch).toHaveProperty('date');
    }
  });

  test('Performance: Response time check', async ({ request }) => {
    const start = Date.now();
    const response = await request.get(`${API_BASE_URL}/matches`);
    const end = Date.now();
    const duration = end - start;

    expect(response.status()).toBe(200);
    expect(duration).toBeLessThan(500); // < 500ms
  });

  test('Response Status: Unauthorized access', async ({ request }) => {
    // Attempt to access a protected endpoint without token
    const response = await request.get(`${API_BASE_URL}/user/profile`);
    
    // Expect 401 Unauthorized or 403 Forbidden
    expect([401, 403]).toContain(response.status());
  });

});
