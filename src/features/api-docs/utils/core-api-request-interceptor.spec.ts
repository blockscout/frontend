// SPDX-License-Identifier: LicenseRef-Blockscout

import { describe, test, expect } from 'vitest';

import { createCoreApiRequestInterceptor } from './core-api-request-interceptor';

const CORE_API = {
  endpoint: 'https://eth.example.com',
  host: 'eth.example.com',
  protocol: 'https',
};

const CORE_API_WITH_BASE_PATH = { ...CORE_API, basePath: '/base' };

const LOCAL_CORE_API = {
  endpoint: 'http://localhost:3003',
  host: 'localhost',
  protocol: 'http',
  port: '3003',
};

describe('createCoreApiRequestInterceptor', () => {
  test('leaves the request that loads the spec document untouched', () => {
    const interceptor = createCoreApiRequestInterceptor(CORE_API_WITH_BASE_PATH);
    const req = { url: 'http://localhost/api/v2/blocks', loadSpec: true };

    expect(interceptor(req)).toBe(req);
    expect(req).toEqual({ url: 'http://localhost/api/v2/blocks', loadSpec: true });
  });

  test('returns the request object it was given', () => {
    const interceptor = createCoreApiRequestInterceptor(CORE_API);
    const req = { url: 'http://localhost/api/v2/blocks', method: 'GET' };

    expect(interceptor(req)).toBe(req);
    expect(req.method).toBe('GET');
  });

  test('leaves a URL of another server exactly as it is', () => {
    const interceptor = createCoreApiRequestInterceptor(CORE_API_WITH_BASE_PATH);
    const req = { url: 'https://stats.example.com/api/v1/counters?foo=bar' };

    expect(interceptor(req).url).toBe('https://stats.example.com/api/v1/counters?foo=bar');
  });

  test('does not normalize a URL of another server', () => {
    const interceptor = createCoreApiRequestInterceptor(CORE_API_WITH_BASE_PATH);
    const req = { url: 'https://stats.example.com' };

    expect(interceptor(req).url).toBe('https://stats.example.com');
  });

  test('leaves a request without a string URL untouched and does not throw', () => {
    const interceptor = createCoreApiRequestInterceptor(CORE_API_WITH_BASE_PATH);
    const req = { method: 'GET' };

    expect(interceptor(req)).toBe(req);
    expect(req).toEqual({ method: 'GET' });
  });

  describe('legacy placeholder server', () => {
    test('points the URL at the instance host', () => {
      const interceptor = createCoreApiRequestInterceptor(CORE_API);
      const req = { url: 'https://blockscout.com/poa/core/api/v2/blocks?type=block' };

      expect(interceptor(req).url).toBe('https://eth.example.com/api/v2/blocks?type=block');
    });

    test('treats an empty base path as no base path', () => {
      const interceptor = createCoreApiRequestInterceptor({ ...CORE_API, basePath: '' });
      const req = { url: 'https://blockscout.com/poa/core/api/v2/blocks' };

      expect(interceptor(req).url).toBe('https://eth.example.com/api/v2/blocks');
    });

    test('prefixes the base path to the pathname', () => {
      const interceptor = createCoreApiRequestInterceptor(CORE_API_WITH_BASE_PATH);
      const req = { url: 'https://blockscout.com/poa/core/api/v2/blocks?type=block' };

      expect(interceptor(req).url).toBe('https://eth.example.com/base/api/v2/blocks?type=block');
    });

    test('does not duplicate the base path the pathname already contains', () => {
      const interceptor = createCoreApiRequestInterceptor(CORE_API_WITH_BASE_PATH);
      const req = { url: 'https://blockscout.com/poa/core/base/api/v2/blocks' };

      expect(interceptor(req).url).toBe('https://eth.example.com/base/api/v2/blocks');
    });

    test('applies the protocol and the port of the instance', () => {
      const interceptor = createCoreApiRequestInterceptor({ ...CORE_API, protocol: 'http', port: '3003' });
      const req = { url: 'https://blockscout.com/poa/core/api/v2/blocks?type=block' };

      expect(interceptor(req).url).toBe('http://eth.example.com:3003/api/v2/blocks?type=block');
    });

    test('changes the protocol and keeps the default port when the instance has no port', () => {
      const interceptor = createCoreApiRequestInterceptor({ ...CORE_API, protocol: 'http' });
      const req = { url: 'https://blockscout.com/poa/core/api/v2/blocks' };

      expect(interceptor(req).url).toBe('http://eth.example.com/api/v2/blocks');
    });

    test('keeps the port of the instance host when the instance port is empty', () => {
      const interceptor = createCoreApiRequestInterceptor({ ...CORE_API, host: 'eth.example.com:8080', port: '' });
      const req = { url: 'https://blockscout.com/poa/core/api/v2/blocks' };

      expect(interceptor(req).url).toBe('https://eth.example.com:8080/api/v2/blocks');
    });

    test('wins over the current placeholder server when the URL contains both', () => {
      const interceptor = createCoreApiRequestInterceptor(CORE_API_WITH_BASE_PATH);
      const req = { url: 'https://blockscout.com/poa/core/api/v2/search?q=http://localhost/api' };

      expect(interceptor(req).url).toBe('https://eth.example.com/base/api/v2/search?q=http://localhost/api');
    });

    test('leaves the request untouched when the instance host makes the URL invalid', () => {
      const interceptor = createCoreApiRequestInterceptor({ ...CORE_API, host: 'not a host' });
      const req = { url: 'https://blockscout.com/poa/core/api/v2/blocks' };

      expect(interceptor(req)).toBe(req);
      expect(req.url).toBe('https://blockscout.com/poa/core/api/v2/blocks');
    });
  });

  describe('current placeholder server with the API prefix', () => {
    test('points the URL at the instance endpoint', () => {
      const interceptor = createCoreApiRequestInterceptor(CORE_API);
      const req = { url: 'http://localhost/api/v2/blocks?type=block' };

      expect(interceptor(req).url).toBe('https://eth.example.com/api/v2/blocks?type=block');
    });

    test('inserts the base path before the API prefix', () => {
      const interceptor = createCoreApiRequestInterceptor(CORE_API_WITH_BASE_PATH);
      const req = { url: 'http://localhost/api/v2/blocks?type=block' };

      expect(interceptor(req).url).toBe('https://eth.example.com/base/api/v2/blocks?type=block');
    });

    test('keeps the port of the instance endpoint', () => {
      const interceptor = createCoreApiRequestInterceptor(LOCAL_CORE_API);
      const req = { url: 'http://localhost/api/v2/blocks?type=block' };

      expect(interceptor(req).url).toBe('http://localhost:3003/api/v2/blocks?type=block');
    });
  });

  describe('current placeholder server without the API prefix', () => {
    test('points the URL at the instance endpoint', () => {
      const interceptor = createCoreApiRequestInterceptor(CORE_API);
      const req = { url: 'http://localhost/health?full=true' };

      expect(interceptor(req).url).toBe('https://eth.example.com/health?full=true');
    });

    test('inserts the base path after the instance endpoint', () => {
      const interceptor = createCoreApiRequestInterceptor(CORE_API_WITH_BASE_PATH);
      const req = { url: 'http://localhost/health' };

      expect(interceptor(req).url).toBe('https://eth.example.com/base/health');
    });

    test('writes the rewritten URL back in normalized form', () => {
      const interceptor = createCoreApiRequestInterceptor(CORE_API);
      const req = { url: 'http://localhost' };

      expect(interceptor(req).url).toBe('https://eth.example.com/');
    });
  });

  test('leaves the request untouched and does not throw when the instance endpoint is not a URL', () => {
    const interceptor = createCoreApiRequestInterceptor({ ...CORE_API_WITH_BASE_PATH, endpoint: 'not a url' });
    const withApiPrefix = { url: 'http://localhost/api/v2/blocks?type=block' };
    const withoutApiPrefix = { url: 'http://localhost/health' };

    expect(() => interceptor(withApiPrefix)).not.toThrow();
    expect(withApiPrefix.url).toBe('http://localhost/api/v2/blocks?type=block');
    expect(interceptor(withoutApiPrefix)).toBe(withoutApiPrefix);
    expect(withoutApiPrefix.url).toBe('http://localhost/health');
  });
});
