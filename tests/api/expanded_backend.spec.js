// @ts-check
const { test, expect } = require('@playwright/test');
const request = require('supertest');

// Updated API Base URL
const API_BASE_URL = 'https://production-umpire-api.tisagroup.ch/api/v3';

// Assuming we might need a token, fetching it from env or using a placeholder
const AUTH_TOKEN = process.env.API_AUTH_TOKEN || ''; 

test.describe('Umpire API v3 Expanded Tests', () => {

  // 1. Authentication & Security
  test.describe('Authentication', () => {
    test('Should return 401 Unauthorized for protected endpoints without token', async () => {
      await request(API_BASE_URL)
        .get('/matches')
        .expect(401)
        .then((res) => {
           // Verify standard error structure if possible
           // expect(res.body).toHaveProperty('errors');
        });
    });

    test('Should handle invalid tokens gracefully', async () => {
      await request(API_BASE_URL)
        .get('/matches')
        .set('Authorization', 'Bearer invalid_token_123')
        .expect(res => {
          if (res.status < 400 || res.status >= 500) {
            throw new Error(`Expected 4xx auth error, got ${res.status}`);
          }
        });
    });
  });

  // 2. Resource Validation (Happy Paths - assuming we had a token)
  // Note: These will fail 401 without a real token, but show the structure
  test.describe('Matches Resource', () => {
    
    test('Should fetch list of matches (schema validation)', async () => {
      // If we don't have a token, we skip or expect 401, but here is the logic for a 200
      if (!AUTH_TOKEN) {
          test.skip(true, 'No AUTH_TOKEN provided');
      }

      await request(API_BASE_URL)
        .get('/matches')
        .set('Authorization', `Bearer ${AUTH_TOKEN}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .then((res) => {
          const data = res.body.data || res.body;
          expect(Array.isArray(data)).toBeTruthy();
          
          if (data.length > 0) {
            const match = data[0];
            // Detailed Schema Validation
            expect(match).toHaveProperty('id');
            expect(match).toHaveProperty('homeTeam');
            expect(match).toHaveProperty('awayTeam');
            expect(match).toHaveProperty('startDate');
            expect(typeof match.id).toBe('string'); // or number
          }
        });
    });

    test('Should handle non-existent match ID', async () => {
      if (!AUTH_TOKEN) {
          test.skip(true, 'No AUTH_TOKEN provided');
      }

      await request(API_BASE_URL)
        .get('/matches/99999999_invalid_id')
        .set('Authorization', `Bearer ${AUTH_TOKEN}`)
        .expect(404);
    });
  });

  // 3. Filtering and Pagination
  test.describe('Filtering & Pagination', () => {
    test('Should support limit parameter', async () => {
      if (!AUTH_TOKEN) {
          test.skip(true, 'No AUTH_TOKEN provided');
      }

      await request(API_BASE_URL)
        .get('/matches?limit=5')
        .set('Authorization', `Bearer ${AUTH_TOKEN}`)
        .expect(200)
        .then((res) => {
          const data = res.body.data || res.body;
          expect(data.length).toBeLessThanOrEqual(5);
        });
    });
  });

  // 4. Performance & Headers
  test.describe('Performance & Headers', () => {
    test('Response time should be acceptable (<1000ms)', async () => {
      const start = Date.now();
      // Using a likely lighter endpoint like /competitions or just hitting /matches expecting 401 is fast
      await request(API_BASE_URL)
        .get('/matches') 
        .expect((res) => {
            // We accept 401 or 200 here just to measure network latency
            if (res.status !== 200 && res.status !== 401) throw new Error('Unexpected status');
        })
        .then(() => {
          const duration = Date.now() - start;
          console.log(`Request took ${duration}ms`);
          expect(duration).toBeLessThan(1000);
        });
    });

    test('Should return correct Content-Type header', async () => {
      await request(API_BASE_URL)
        .get('/matches')
        .then((res) => {
            // Based on previous curl: application/vnd.api+json; charset=utf-8
            expect(res.headers['content-type']).toMatch(/vnd\.api\+json/);
        });
    });
  });

});
