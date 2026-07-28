// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextRequest } from 'next/server';

import { describe, expect, it } from 'vitest';

const NONCE = 'aabbccddeeff00112233445566778899';

// the nonce only lands in the policy when an ads provider that needs it is configured;
// the app config is frozen on first import, so it has to be set before anything pulls it in
process.env.NEXT_PUBLIC_AD_BANNER_PROVIDER = 'sevio';

const csp = await import('./index');
const generateCspPolicy = (await import('./generateCspPolicy')).default;
const primerScriptHashes = await (await import('src/server/primedRequests')).getPrimerScriptCspHashes();

function makeRequest({ pathname = '/', appProfile }: { pathname?: string; appProfile?: string } = {}) {
  return {
    headers: new Headers(appProfile ? { 'x-app-profile': appProfile } : undefined),
    nextUrl: { pathname, searchParams: new URLSearchParams() },
    cookies: { get: () => undefined },
  } as unknown as NextRequest;
}

describe('nonce policies', () => {
  it('guards against a vacuous suite — the nonce must be part of the policy', async() => {
    expect(await csp.get(makeRequest(), NONCE)).toContain(`'nonce-${ NONCE }'`);
  });

  it('matches a policy generated from scratch for the same nonce', async() => {
    expect(await csp.get(makeRequest(), NONCE)).toBe(generateCspPolicy(false, NONCE, primerScriptHashes));
  });

  it('matches a policy generated from scratch in private mode', async() => {
    expect(await csp.get(makeRequest({ appProfile: 'private' }), NONCE))
      .toBe(generateCspPolicy(true, NONCE, primerScriptHashes));
  });

  it('does not leak a nonce between requests', async() => {
    const otherNonce = '99887766554433221100ffeeddccbbaa';

    await csp.get(makeRequest(), NONCE);
    const policy = await csp.get(makeRequest(), otherNonce);

    expect(policy).toContain(`'nonce-${ otherNonce }'`);
    expect(policy).not.toContain(NONCE);
  });

  it('does not leak the placeholder', async() => {
    expect(await csp.get(makeRequest(), NONCE)).not.toContain(csp.CSP_NONCE_PLACEHOLDER);
  });
});

describe('nonceless policies', () => {
  it('matches a policy generated from scratch', async() => {
    expect(await csp.get(makeRequest())).toBe(generateCspPolicy(false, undefined, primerScriptHashes));
    expect(await csp.get(makeRequest({ appProfile: 'private' }))).toBe(generateCspPolicy(true, undefined, primerScriptHashes));
  });
});
