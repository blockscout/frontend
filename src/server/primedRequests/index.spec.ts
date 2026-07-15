// @vitest-environment jsdom

import buildHeaders from 'src/api/utils/build-headers';
import buildUrl from 'src/api/utils/build-url';

import { afterEach, describe, expect, it } from 'vitest';

import { getPrimerScript, getPrimerScriptCspHashes } from './index';
import { PRIMED_PAGES } from './registry';

// the home page resources under the vitest config (feature-dependent entries may be absent —
// the tests cover the default behavior, not the full list)
const HOME_RESOURCES = PRIMED_PAGES['/']().map(({ resource }) => resource);

function runScript(script: string) {
  new Function(script)();
}

function clearCookies() {
  document.cookie.split(';').forEach((cookie) => {
    const name = cookie.split('=')[0].trim();
    if (name) {
      document.cookie = `${ name }=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
  });
}

afterEach(() => {
  clearCookies();
  window.__primedFetches = undefined;
  fetchMock.resetMocks();
});

describe('getPrimerScript', () => {
  it('returns an empty string for a page without primed requests', () => {
    expect(getPrimerScript('/txs')).toBe('');
    expect(getPrimerScript(undefined)).toBe('');
  });

  it('primes every first-render request of the home page', () => {
    // guard against the registry-derived list being empty, which would make these tests vacuous
    expect(HOME_RESOURCES.length).toBeGreaterThan(0);

    const script = getPrimerScript('/');
    HOME_RESOURCES.forEach((resource) => {
      expect(script).toContain(buildUrl(resource));
    });
  });

  it('includes static per-resource headers resolved on the server', () => {
    // core:stats declares { 'updated-gas-oracle': 'true' } in the resource registry
    expect(getPrimerScript('/')).toContain('updated-gas-oracle');
  });
});

describe('inline script', () => {
  it('fires one request per resource and stores the promises in window.__primedFetches', () => {
    fetchMock.mockResponse(JSON.stringify({}));

    runScript(getPrimerScript('/'));

    expect(window.__primedFetches?.size).toBe(HOME_RESOURCES.length);
    expect(fetchMock.requests()).toHaveLength(HOME_RESOURCES.length);
    HOME_RESOURCES.forEach((resource) => {
      expect(window.__primedFetches?.get(buildUrl(resource))).toBeDefined();
    });
  });

  it('sends exactly the headers the client fetch layer would send, without cookies', () => {
    fetchMock.mockResponse(JSON.stringify({}));

    runScript(getPrimerScript('/'));

    HOME_RESOURCES.forEach((resource) => {
      const entry = window.__primedFetches?.get(buildUrl(resource));
      expect(entry?.headers).toEqual(buildHeaders(resource));
    });
  });

  it('sends exactly the headers the client fetch layer would send, with cookies set', () => {
    fetchMock.mockResponse(JSON.stringify({}));
    document.cookie = 'api_temp_token=secret-temp-token';
    document.cookie = 'show_scam_tokens=true';

    runScript(getPrimerScript('/'));

    HOME_RESOURCES.forEach((resource) => {
      const entry = window.__primedFetches?.get(buildUrl(resource));
      // buildHeaders runs in the same jsdom and reads the same cookies via js-cookie —
      // this is the exact invariant the consume-time comparison in primed-fetch.ts checks
      expect(entry?.headers).toEqual(buildHeaders(resource));
    });

    const statsEntry = window.__primedFetches?.get(buildUrl('core:stats'));
    expect(statsEntry?.headers).toMatchObject({
      'api-v2-temp-token': 'secret-temp-token',
      'show-scam-tokens': 'true',
    });
  });

  it('does not send cookie-derived headers for non-core resources', () => {
    fetchMock.mockResponse(JSON.stringify({}));
    document.cookie = 'api_temp_token=secret-temp-token';

    runScript(getPrimerScript('/'));

    const entry = window.__primedFetches?.get(buildUrl('stats:pages_main'));
    expect(entry?.headers).not.toHaveProperty('api-v2-temp-token');
  });

  it('suppresses rejections of primed requests that are never consumed', async() => {
    fetchMock.mockReject(new Error('network down'));

    runScript(getPrimerScript('/'));

    // an unhandled rejection here would fail the test run
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(window.__primedFetches?.size).toBe(HOME_RESOURCES.length);
  });
});

describe('getPrimerScriptCspHashes', () => {
  it('produces one quoted sha256 token per registered page', async() => {
    const hashes = await getPrimerScriptCspHashes();

    expect(hashes).toHaveLength(1);
    hashes.forEach((hash) => {
      expect(hash).toMatch(/^'sha256-[A-Za-z0-9+/]+={0,2}'$/);
    });
  });
});
