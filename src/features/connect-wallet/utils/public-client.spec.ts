import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const PUBLIC_CLIENT = { __brand: 'public-client' };
const HTTP_TRANSPORT = { __brand: 'http-transport' };

const viemMock = vi.hoisted(() => ({
  createPublicClient: vi.fn(),
  http: vi.fn(),
}));

const chainsMock = vi.hoisted(() => ({
  currentChain: undefined as { rpcUrls: { 'default': { http: Array<string> } } } | undefined,
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
  });

  describe('isPublicClientAvailable', () => {
    it('is true when the current chain has a non-empty RPC URL', async() => {
      chainsMock.currentChain = { rpcUrls: { 'default': { http: [ 'https://rpc.example' ] } } };
      const { isPublicClientAvailable } = await importModule();
      expect(isPublicClientAvailable).toBe(true);
    });

    it('is true when at least one RPC URL is non-empty (mirrors the filter(Boolean) guard)', async() => {
      chainsMock.currentChain = { rpcUrls: { 'default': { http: [ '', 'https://rpc.example' ] } } };
      const { isPublicClientAvailable } = await importModule();
      expect(isPublicClientAvailable).toBe(true);
    });

    it('is false when the current chain is defined but has no non-empty RPC URL', async() => {
      chainsMock.currentChain = { rpcUrls: { 'default': { http: [ '' ] } } };
      const { isPublicClientAvailable } = await importModule();
      expect(isPublicClientAvailable).toBe(false);
    });

    it('is true when there is no current chain (matches the old module-scope truthiness)', async() => {
      chainsMock.currentChain = undefined;
      const { isPublicClientAvailable } = await importModule();
      expect(isPublicClientAvailable).toBe(true);
    });
  });

  describe('getPublicClient', () => {
    it('builds the client lazily with the same options the module scope used', async() => {
      chainsMock.currentChain = { rpcUrls: { 'default': { http: [ 'https://rpc.example' ] } } };
      const { getPublicClient } = await importModule();

      expect(viemMock.createPublicClient).not.toHaveBeenCalled();

      const client = await getPublicClient();

      expect(client).toBe(PUBLIC_CLIENT);
      expect(viemMock.createPublicClient).toHaveBeenCalledWith({
        chain: chainsMock.currentChain,
        transport: HTTP_TRANSPORT,
        batch: { multicall: true },
      });
    });

    it('imports viem and builds the client only once across calls (memoized single-flight)', async() => {
      chainsMock.currentChain = { rpcUrls: { 'default': { http: [ 'https://rpc.example' ] } } };
      const { getPublicClient } = await importModule();

      const [ a, b ] = await Promise.all([ getPublicClient(), getPublicClient() ]);
      const c = await getPublicClient();

      expect(a).toBe(PUBLIC_CLIENT);
      expect(b).toBe(a);
      expect(c).toBe(a);
      expect(viemMock.createPublicClient).toHaveBeenCalledTimes(1);
    });

    it('resolves to undefined without importing viem when no client is available', async() => {
      chainsMock.currentChain = { rpcUrls: { 'default': { http: [ '' ] } } };
      const { getPublicClient } = await importModule();

      await expect(getPublicClient()).resolves.toBeUndefined();
      expect(viemMock.createPublicClient).not.toHaveBeenCalled();
    });

    it('degrades to undefined when client construction throws', async() => {
      chainsMock.currentChain = { rpcUrls: { 'default': { http: [ 'https://rpc.example' ] } } };
      viemMock.createPublicClient.mockImplementation(() => {
        throw new Error('boom');
      });
      const { getPublicClient } = await importModule();

      await expect(getPublicClient()).resolves.toBeUndefined();
    });
  });
});
