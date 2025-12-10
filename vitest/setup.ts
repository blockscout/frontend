import dotenv from 'dotenv';
import { vi } from 'vitest';
import createFetchMock from 'vitest-fetch-mock';

const envs = dotenv.config({ path: './configs/envs/.env.jest' });

const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks();

Object.defineProperty(globalThis, '__envs', {
  writable: true,
  value: envs.parsed || {},
});
