// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';

import takePrimedFetch from './primed-fetch';

const URL = 'https://example.com/api/v2/stats';

function prime(headers: Record<string, string>) {
  const promise = Promise.resolve(new Response('{}'));
  window.__primedFetches = new Map([ [ URL, { promise, headers } ] ]);
  return promise;
}

afterEach(() => {
  window.__primedFetches = undefined;
});

describe('takePrimedFetch', () => {
  it('returns the primed promise when the headers match, and only once', () => {
    const promise = prime({ 'updated-gas-oracle': 'true' });

    expect(takePrimedFetch(URL, { 'updated-gas-oracle': 'true' })).toBe(promise);
    expect(takePrimedFetch(URL, { 'updated-gas-oracle': 'true' })).toBeUndefined();
  });

  it('ignores header name casing and order', () => {
    const promise = prime({ 'X-Endpoint': 'https://example.com', 'show-scam-tokens': 'true' });

    expect(takePrimedFetch(URL, { 'show-scam-tokens': 'true', 'x-endpoint': 'https://example.com' })).toBe(promise);
  });

  it('treats an empty headers object and undefined as equal', () => {
    const promise = prime({});

    expect(takePrimedFetch(URL, undefined)).toBe(promise);
  });

  it('discards the primed request when the headers differ', () => {
    prime({ 'api-v2-temp-token': 'stale-token' });

    expect(takePrimedFetch(URL, { 'api-v2-temp-token': 'fresh-token' })).toBeUndefined();
    // the entry is consumed either way — it must not be picked up later
    expect(window.__primedFetches?.size).toBe(0);
  });

  it('returns undefined when nothing was primed for the url', () => {
    prime({});

    expect(takePrimedFetch('https://example.com/other', undefined)).toBeUndefined();
    expect(window.__primedFetches?.size).toBe(1);
  });

  it('rejects when the signal is already aborted', async() => {
    prime({});
    const controller = new AbortController();
    controller.abort();

    const result = takePrimedFetch(URL, {}, controller.signal);
    await expect(result).rejects.toMatchObject({ name: 'AbortError' });
    expect(window.__primedFetches?.size).toBe(0);
  });

  it('rejects when the signal aborts before the primed response resolves', async() => {
    let resolveResponse!: (response: Response) => void;
    const promise = new Promise<Response>((resolve) => {
      resolveResponse = resolve;
    });
    window.__primedFetches = new Map([ [ URL, { promise, headers: {} } ] ]);

    const controller = new AbortController();
    const result = takePrimedFetch(URL, {}, controller.signal);

    controller.abort();
    await expect(result).rejects.toMatchObject({ name: 'AbortError' });

    // resolving the underlying primed fetch after abort must not settle the consumer as fulfilled
    resolveResponse(new Response('{}'));
    await promise;
  });
});
