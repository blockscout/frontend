import { describe, it, expect, vi } from 'vitest';

import getAllowedApiOrigins from './getAllowedApiOrigins';

vi.mock('src/config', () => ({
  'default': {
    apis: {
      core: { endpoint: 'https://core.example.com' },
      stats: { endpoint: 'https://stats.example.com:8443' },
      // invalid endpoint should be ignored, not throw
      broken: { endpoint: 'not-a-url' },
      // undefined api should be ignored
      admin: undefined,
    },
  },
}));

vi.mock('src/features/multichain/chains-config', () => ({
  'default': () => ({
    chains: [
      { app_config: { apis: { core: { endpoint: 'https://chain-a.example.com' } } } },
      { app_config: { apis: { core: { endpoint: 'https://chain-b.example.com' } } } },
    ],
  }),
}));

vi.mock('src/features/marketplace/chains-config/essential-dapps', () => ({
  'default': () => ({
    chains: [
      { app_config: { apis: { core: { endpoint: 'https://dapp-chain.example.com' } } } },
      // chain without app_config should be ignored
      {},
    ],
  }),
}));

describe('getAllowedApiOrigins', () => {
  it('collects origins from local, multichain and essential dapps config', () => {
    const origins = getAllowedApiOrigins();

    expect(origins.has('https://core.example.com')).toBe(true);
    expect(origins.has('https://stats.example.com:8443')).toBe(true);
    expect(origins.has('https://chain-a.example.com')).toBe(true);
    expect(origins.has('https://chain-b.example.com')).toBe(true);
    expect(origins.has('https://dapp-chain.example.com')).toBe(true);
  });

  it('ignores endpoints that are not valid URLs', () => {
    const origins = getAllowedApiOrigins();

    expect([ ...origins ].some((origin) => origin.includes('not-a-url'))).toBe(false);
  });

  it('rejects origins that are not present in the configuration', () => {
    const origins = getAllowedApiOrigins();

    expect(origins.has('http://169.254.169.254')).toBe(false);
    expect(origins.has('http://localhost:3000')).toBe(false);
    expect(origins.has('https://evil.example.com')).toBe(false);
  });
});
