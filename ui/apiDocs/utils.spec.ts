import type { ApiPropsFull } from 'configs/app/apis';
import { describe, test, expect } from 'vitest';

import { coreApiRequestInterceptorFactory } from './utils';

const api: ApiPropsFull = {
  endpoint: 'https://example.com',
  basePath: '/blockscout',
  host: 'example.com',
  protocol: 'https',
  socketEndpoint: 'wss://example.com',
};

const apiWithoutBasePath: ApiPropsFull = {
  endpoint: 'https://example.com',
  basePath: '',
  host: 'example.com',
  protocol: 'https',
  socketEndpoint: 'wss://example.com',
};

const apiWithPort: ApiPropsFull = {
  endpoint: 'https://example.com:8080',
  basePath: '/blockscout',
  host: 'example.com',
  protocol: 'https',
  port: '8080',
  socketEndpoint: 'wss://example.com:8080',
};

describe('coreApiRequestInterceptorFactory', () => {
  describe('DEFAULT_SERVER (blockscout.com/poa/core)', () => {
    test('replaces host and adds basePath', () => {
      const interceptor = coreApiRequestInterceptorFactory(api);
      const req = { url: 'http://blockscout.com/poa/core/api/v2/search?q=test' };
      const result = interceptor(req);
      expect(result.url).toBe('https://example.com/blockscout/api/v2/search?q=test');
    });

    test('does not duplicate basePath if already present', () => {
      const interceptor = coreApiRequestInterceptorFactory(api);
      const req = { url: 'http://blockscout.com/poa/core/blockscout/api/v2/search' };
      const result = interceptor(req);
      expect(result.url).toContain('/blockscout/api/v2/search');
      expect(result.url).not.toContain('/blockscout/blockscout');
    });

    test('skips basePath when empty', () => {
      const interceptor = coreApiRequestInterceptorFactory(apiWithoutBasePath);
      const req = { url: 'http://blockscout.com/poa/core/api/v2/search' };
      const result = interceptor(req);
      expect(result.url).toBe('https://example.com/api/v2/search');
    });

    test('applies port when configured', () => {
      const interceptor = coreApiRequestInterceptorFactory(apiWithPort);
      const req = { url: 'http://blockscout.com/poa/core/api/v2/search' };
      const result = interceptor(req);
      expect(result.url).toBe('https://example.com:8080/blockscout/api/v2/search');
    });
  });

  describe('DEFAULT_SERVER_NEW (http://localhost/api)', () => {
    test('replaces with endpoint + basePath', () => {
      const interceptor = coreApiRequestInterceptorFactory(api);
      const req = { url: 'http://localhost/api/v2/search?q=test' };
      const result = interceptor(req);
      expect(result.url).toBe('https://example.com/blockscout/api/v2/search?q=test');
    });

    test('works without basePath', () => {
      const interceptor = coreApiRequestInterceptorFactory(apiWithoutBasePath);
      const req = { url: 'http://localhost/api/v2/search' };
      const result = interceptor(req);
      expect(result.url).toBe('https://example.com/api/v2/search');
    });
  });

  test('does not modify loadSpec requests', () => {
    const interceptor = coreApiRequestInterceptorFactory(api);
    const req = { url: 'http://blockscout.com/poa/core/api/v2/search', loadSpec: true };
    const result = interceptor(req);
    expect(result.url).toBe('http://blockscout.com/poa/core/api/v2/search');
  });

  test('does not modify unmatched URLs', () => {
    const interceptor = coreApiRequestInterceptorFactory(api);
    const req = { url: 'https://other-server.com/api/v2/search' };
    const result = interceptor(req);
    expect(result.url).toBe('https://other-server.com/api/v2/search');
  });
});
