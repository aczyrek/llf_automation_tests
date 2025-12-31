// @ts-check
const { test, expect } = require('@playwright/test');
const request = require('supertest');

const API_BASE_URL = process.env.API_BASE_URL || 'https://online.futbolas.tv/api/v1';

test.describe('Backend API Tests (Supertest)', () => {

  test('Endpoint Validation: Fetch match list using Supertest', async () => {
    // Supertest expects a URL or an app instance. 
    // We pass the base URL and chain the request methods.
    
    await request(API_BASE_URL)
      .get('/matches')
      .expect(200) // Supertest assertion for status code
      .expect('Content-Type', /json/) // Supertest assertion for header
      .then((response) => {
        // Additional assertions using Playwright's expect or standard logic
        const body = response.body;
        const matches = Array.isArray(body) ? body : body.data || [];
        
        if (matches.length > 0) {
          const firstMatch = matches[0];
          expect(firstMatch).toHaveProperty('id');
          expect(firstMatch).toHaveProperty('title');
          expect(firstMatch).toHaveProperty('date');
        }
      });
  });

  test('Response Status: Unauthorized access using Supertest', async () => {
    await request(API_BASE_URL)
      .get('/user/profile')
      .expect((res) => {
        // Custom assertion for status code being 401 or 403
        if (res.status !== 401 && res.status !== 403) {
          throw new Error(`Expected 401 or 403, got ${res.status}`);
        }
      });
  });

  test('Performance: Response time check using Supertest', async () => {
    const start = Date.now();
    
    await request(API_BASE_URL)
      .get('/matches')
      .expect(200)
      .then(() => {
        const end = Date.now();
        const duration = end - start;
        console.log(`Supertest request duration: ${duration}ms`);
        expect(duration).toBeLessThan(500); // < 500ms
      });
  });

});
