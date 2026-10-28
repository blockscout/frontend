// SPDX-License-Identifier: LicenseRef-Blockscout
// @vitest-environment jsdom

import * as cookies from 'src/shared/storage/cookies';

import { afterEach, describe, expect, it } from 'vitest';

import { getCustomRpcUrl, getRpcUrls, resolveCustomRpcUrl } from './rpc-urls';

const CONFIGURED_RPC_URL = 'https://localhost:1111';
const CORE_API_ETH_RPC_URL = 'https://localhost:3003/api/eth-rpc';
const CUSTOM_RPC_URL = 'https://rpc.custom.example';

// jsdom serves the test page over http, where a `secure` cookie is silently dropped
const COOKIE_ATTRIBUTES = { secure: false };

function setCookie(name: cookies.NAMES, value: string | undefined) {
  value === undefined ? cookies.remove(name) : cookies.set(name, value, COOKIE_ATTRIBUTES);
}

function setCustomRpcCookies(url?: string, inUse?: string) {
  setCookie(cookies.NAMES.CUSTOM_RPC_URL, url);
  setCookie(cookies.NAMES.CUSTOM_RPC_IN_USE, inUse);
}

afterEach(() => {
  setCustomRpcCookies();
});

describe('resolveCustomRpcUrl', () => {
  it('returns the URL when it is https and the flag is on', () => {
    expect(resolveCustomRpcUrl(CUSTOM_RPC_URL, 'true')).toBe(CUSTOM_RPC_URL);
  });

  it('ignores the URL when the flag is off or missing', () => {
    expect(resolveCustomRpcUrl(CUSTOM_RPC_URL, 'false')).toBeUndefined();
    expect(resolveCustomRpcUrl(CUSTOM_RPC_URL, undefined)).toBeUndefined();
  });

  it('ignores a non-https URL', () => {
    expect(resolveCustomRpcUrl('http://rpc.custom.example', 'true')).toBeUndefined();
    expect(resolveCustomRpcUrl('javascript:alert(1)', 'true')).toBeUndefined();
  });

  it('ignores a value that is not a URL', () => {
    expect(resolveCustomRpcUrl('not a url', 'true')).toBeUndefined();
    expect(resolveCustomRpcUrl('', 'true')).toBeUndefined();
    expect(resolveCustomRpcUrl(undefined, 'true')).toBeUndefined();
  });
});

describe('getCustomRpcUrl', () => {
  it('reads the URL from the cookies when it is in use', () => {
    setCustomRpcCookies(CUSTOM_RPC_URL, 'true');
    expect(getCustomRpcUrl()).toBe(CUSTOM_RPC_URL);
  });

  it('is undefined when the cookies are not set', () => {
    expect(getCustomRpcUrl()).toBeUndefined();
  });

  it('is undefined when the URL is stored but not in use', () => {
    setCustomRpcCookies(CUSTOM_RPC_URL, 'false');
    expect(getCustomRpcUrl()).toBeUndefined();
  });
});

describe('getRpcUrls', () => {
  it('returns only the custom URL while it is in use', () => {
    setCustomRpcCookies(CUSTOM_RPC_URL, 'true');
    expect(getRpcUrls({ withCoreApiFallback: true })).toEqual([ CUSTOM_RPC_URL ]);
  });

  it('returns the configured URLs when no custom URL is set', () => {
    expect(getRpcUrls()).toEqual([ CONFIGURED_RPC_URL ]);
  });

  it('returns the configured URLs when the custom URL is invalid', () => {
    setCustomRpcCookies('http://rpc.custom.example', 'true');
    expect(getRpcUrls()).toEqual([ CONFIGURED_RPC_URL ]);
  });

  it('returns the configured URLs when the custom URL is stored but not in use', () => {
    setCustomRpcCookies(CUSTOM_RPC_URL, undefined);
    expect(getRpcUrls()).toEqual([ CONFIGURED_RPC_URL ]);
  });

  it('appends the core API eth-rpc fallback to the configured URLs when asked', () => {
    expect(getRpcUrls({ withCoreApiFallback: true })).toEqual([ CONFIGURED_RPC_URL, CORE_API_ETH_RPC_URL ]);
  });
});
