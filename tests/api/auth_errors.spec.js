const { test, expect } = require('@playwright/test');
const request = require('supertest');

const API_BASE_URL = process.env.API_BASE_URL || 'https://production-umpire-api.tisagroup.ch/api/v3';

test.describe('API Unauthorized Behavior', () => {
  test('Unauthorized returns 4xx and JSON content-type', async () => {
    await request(API_BASE_URL)
      .get('/matches')
      .expect(res => {
        expect(res.status).toBeGreaterThanOrEqual(400);
        expect(res.status).toBeLessThan(500);
        expect(res.headers['content-type']).toMatch(/json/);
      });
  });
});