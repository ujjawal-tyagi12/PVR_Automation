import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

export const config = {
  baseUrl: process.env.BASE_URL || 'https://example.com',
  apiBaseUrl: process.env.API_BASE_URL || 'https://example.com/api',
  credentials: {
    username: process.env.TEST_USERNAME || '',
    password: process.env.TEST_PASSWORD || '',
  },
  apiTimeout: Number(process.env.API_TIMEOUT) || 15000,
  logLevel: process.env.LOG_LEVEL || 'info',
};

export type AppConfig = typeof config;
