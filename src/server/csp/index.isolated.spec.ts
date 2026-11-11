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

interface RequestOptions {
  pathname?: string;
  appProfile?: string;
  cookies?: Record<string, string>;
}

function makeRequest({ pathname = '/', appProfile, cookies = {} }: RequestOptions = {}) {
  return {
    headers: new Headers(appProfile ? { 'x-app-profile': appProfile } : undefined),
    nextUrl: { pathname, searchParams: new URLSearchParams() },
    cookies: { get: (name: string) => (name in cookies ? { name, value: cookies[name] } : undefined) },
  } as unknown as NextRequest;
}

const CUSTOM_RPC_URL = 'https://rpc.custom.example:8545/v1/key';
const CUSTOM_RPC_ORIGIN = 'https://rpc.custom.example:8545';

function getConnectSrc(policy: string) {
  return policy.split(';').find((directive) => directive.startsWith('connect-src '));
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

describe('custom RPC node', () => {
  const inUse = { custom_rpc_url: CUSTOM_RPC_URL, custom_rpc_in_use: 'true' };

  it('allows the origin of the custom RPC node in connect-src while it is in use', async() => {
    const connectSrc = getConnectSrc(await csp.get(makeRequest({ cookies: inUse })));

    expect(connectSrc).toContain(` ${ CUSTOM_RPC_ORIGIN } `);
    expect(connectSrc).not.toContain(CUSTOM_RPC_URL);
  });

  it('allows the origin in the nonce policy too', async() => {
    const policy = await csp.get(makeRequest({ cookies: inUse }), NONCE);

    expect(getConnectSrc(policy)).toContain(` ${ CUSTOM_RPC_ORIGIN } `);
    expect(policy).toContain(`'nonce-${ NONCE }'`);
  });

  it('keeps the cached policy untouched for the next request without the cookie', async() => {
    await csp.get(makeRequest({ cookies: inUse }));

    expect(await csp.get(makeRequest())).toBe(generateCspPolicy(false, undefined, primerScriptHashes));
  });

  it('ignores the cookie while the node is stored but not in use', async() => {
    const policy = await csp.get(makeRequest({ cookies: { custom_rpc_url: CUSTOM_RPC_URL } }));

    expect(policy).not.toContain(CUSTOM_RPC_ORIGIN);
  });

  it('ignores an invalid or non-https URL', async() => {
    const http = { custom_rpc_url: 'http://rpc.custom.example', custom_rpc_in_use: 'true' };
    const garbage = { custom_rpc_url: 'not a url', custom_rpc_in_use: 'true' };

    expect(await csp.get(makeRequest({ cookies: http }))).not.toContain('rpc.custom.example');
    expect(await csp.get(makeRequest({ cookies: garbage }))).toBe(generateCspPolicy(false, undefined, primerScriptHashes));
  });
});
