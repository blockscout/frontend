// @vitest-environment jsdom

import * as cookies from 'src/shared/storage/cookies';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import withEnvs from 'vitest/utils/mockEnvs';

const PUBLIC_CLIENT = { __brand: 'public-client' };
const HTTP_TRANSPORT = { __brand: 'http-transport' };
const CONFIGURED_RPC_URL = 'https://localhost:1111';
const CUSTOM_RPC_URL = 'https://rpc.custom.example';
const CURRENT_CHAIN = { id: 1 };
const NO_RPC_URL_ENVS: Array<[ string, string ]> = [ [ 'NEXT_PUBLIC_NETWORK_RPC_URL', '' ] ];

// jsdom serves the test page over http, where a `secure` cookie is silently dropped
const COOKIE_ATTRIBUTES = { secure: false };

const viemMock = vi.hoisted(() => ({
  createPublicClient: vi.fn(),
  http: vi.fn(),
}));

const chainsMock = vi.hoisted(() => ({
  currentChain: undefined as { id: number } | undefined,
}));

vi.mock('viem', () => viemMock);

vi.mock('./chains', () => ({
  get currentChain() {
    return chainsMock.currentChain;
  },
}));

// `isPublicClientAvailable` and the memoized client are module-scope state, so every test
// imports a fresh copy after configuring the mocked chain.
async function importModule() {
  return import('./public-client');
}

function setCustomRpcCookies(url: string, inUse: string) {
  cookies.set(cookies.NAMES.CUSTOM_RPC_URL, url, COOKIE_ATTRIBUTES);
  cookies.set(cookies.NAMES.CUSTOM_RPC_IN_USE, inUse, COOKIE_ATTRIBUTES);
}

describe('public-client', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.resetAllMocks();
    viemMock.http.mockReturnValue(HTTP_TRANSPORT);
    viemMock.createPublicClient.mockReturnValue(PUBLIC_CLIENT);
    chainsMock.currentChain = undefined;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cookies.remove(cookies.NAMES.CUSTOM_RPC_URL);
    cookies.remove(cookies.NAMES.CUSTOM_RPC_IN_USE);
  });

  describe('isPublicClientAvailable', () => {
    it('is true when the current chain has a configured RPC URL', async() => {
      chainsMock.currentChain = CURRENT_CHAIN;
      const { isPublicClientAvailable } = await importModule();
      expect(isPublicClientAvailable).toBe(true);
    });

    it('is false when the current chain is defined but has no RPC URL', async() => {
      chainsMock.currentChain = CURRENT_CHAIN;
      const isPublicClientAvailable = await withEnvs(NO_RPC_URL_ENVS, async() => (await importModule()).isPublicClientAvailable);
      expect(isPublicClientAvailable).toBe(false);
    });

    it('is true when a custom RPC URL is in use even without a configured one', async() => {
      chainsMock.currentChain = CURRENT_CHAIN;
      setCustomRpcCookies(CUSTOM_RPC_URL, 'true');
      const isPublicClientAvailable = await withEnvs(NO_RPC_URL_ENVS, async() => (await importModule()).isPublicClientAvailable);
      expect(isPublicClientAvailable).toBe(true);
    });

    it('is true when there is no current chain (matches the old module-scope truthiness)', async() => {
      chainsMock.currentChain = undefined;
      const { isPublicClientAvailable } = await importModule();
      expect(isPublicClientAvailable).toBe(true);
    });
  });

  describe('getPublicClient', () => {
    it('builds the client lazily over the configured RPC URL', async() => {
      chainsMock.currentChain = CURRENT_CHAIN;
      const { getPublicClient } = await importModule();

      expect(viemMock.createPublicClient).not.toHaveBeenCalled();

      const client = await getPublicClient();

      expect(client).toBe(PUBLIC_CLIENT);
      expect(viemMock.http).toHaveBeenCalledWith(CONFIGURED_RPC_URL);
      expect(viemMock.createPublicClient).toHaveBeenCalledWith({
        chain: chainsMock.currentChain,
        transport: HTTP_TRANSPORT,
        batch: { multicall: true },
      });
    });

    it('builds the client over the custom RPC URL while it is in use', async() => {
      chainsMock.currentChain = CURRENT_CHAIN;
      setCustomRpcCookies(CUSTOM_RPC_URL, 'true');
      const { getPublicClient } = await importModule();

      await getPublicClient();

      expect(viemMock.http).toHaveBeenCalledWith(CUSTOM_RPC_URL);
    });

    it('builds the client over the configured RPC URL while the custom one is stored but not in use', async() => {
      chainsMock.currentChain = CURRENT_CHAIN;
      setCustomRpcCookies(CUSTOM_RPC_URL, 'false');
      const { getPublicClient } = await importModule();

      await getPublicClient();

      expect(viemMock.http).toHaveBeenCalledWith(CONFIGURED_RPC_URL);
    });

    it('imports viem and builds the client only once across calls (memoized single-flight)', async() => {
      chainsMock.currentChain = CURRENT_CHAIN;
      const { getPublicClient } = await importModule();

      const [ a, b ] = await Promise.all([ getPublicClient(), getPublicClient() ]);
      const c = await getPublicClient();

      expect(a).toBe(PUBLIC_CLIENT);
      expect(b).toBe(a);
      expect(c).toBe(a);
      expect(viemMock.createPublicClient).toHaveBeenCalledTimes(1);
    });

    it('resolves to undefined without importing viem when no client is available', async() => {
      chainsMock.currentChain = CURRENT_CHAIN;
      const client = await withEnvs(NO_RPC_URL_ENVS, async() => (await importModule()).getPublicClient());

      expect(client).toBeUndefined();
      expect(viemMock.createPublicClient).not.toHaveBeenCalled();
    });

    it('degrades to undefined when client construction throws', async() => {
      chainsMock.currentChain = CURRENT_CHAIN;
      viemMock.createPublicClient.mockImplementation(() => {
        throw new Error('boom');
      });
      const { getPublicClient } = await importModule();

      await expect(getPublicClient()).resolves.toBeUndefined();
    });
  });
});
