import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load tests/.env.test into process.env before the config is evaluated.
// This means process.env.DATABASE_URL is available below.
dotenv.config({ path: path.join(__dirname, '.env.test') });

export const API_BASE = 'http://localhost:8001';

export default defineConfig({
  testDir: '.',
  // Run tests sequentially to avoid parallel writes to the same test database.
  fullyParallel: false,
  // Fail the run immediately if a test has `.only` left in (useful in CI).
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',

  projects: [
    {
      name: 'api',
      testMatch: 'api/**/*.spec.ts',
      use: {
        baseURL: API_BASE,
      },
    },
    {
      name: 'ui',
      testMatch: 'ui/**/*.spec.ts',
      use: {
        // Use a real Chromium browser. `devices['Desktop Chrome']` sets a
        // realistic viewport and user-agent.
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:5174',
      },
    },
  ],

  // Playwright starts these servers before running tests and stops them after.
  webServer: [
    {
      // Start the backend directly via the venv's uvicorn binary.
      // The `env` option passes DATABASE_URL from .env.test to the backend
      // process, overriding whatever is set in backend/.env.
      // Port 8001 avoids colliding with the dev server on 8000.
      command: '.venv/bin/uvicorn main:app --port 8001',
      cwd: path.join(__dirname, '../backend'),
      port: 8001,
      env: {
        DATABASE_URL: process.env.DATABASE_URL ?? '',
      },
      reuseExistingServer: false,
    },
    {
      command: 'npm run dev -- --port 5174',
      cwd: path.join(__dirname, '../frontend'),
      port: 5174,
      env: { API_PORT: '8001' },
      reuseExistingServer: false,
    },
  ],
});
