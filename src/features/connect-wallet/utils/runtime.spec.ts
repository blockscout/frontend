// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

type OnChange = (data: { address?: string; status: string }, prev: { address?: string; status: string }) => void;
type ModalStateCb = (state: { open: boolean }) => void;

const hydrateOnMount = vi.hoisted(() => vi.fn());

const coreMock = vi.hoisted(() => ({
  hydrate: vi.fn<(config: unknown, params: unknown) => { onMount: () => void }>(),
  watchAccount: vi.fn<(config: unknown, params: { onChange: OnChange }) => () => void>(),
  getAccount: vi.fn<() => { address: string | undefined; status: string }>(),
  disconnect: vi.fn<() => Promise<void>>(),
  signMessage: vi.fn<() => Promise<string>>(),
  switchChain: vi.fn<() => Promise<{ id: number }>>(),
}));

const appKitInstance = vi.hoisted(() => ({
  open: vi.fn(),
  subscribeState: vi.fn<(cb: ModalStateCb) => () => void>(),
  setThemeMode: vi.fn(),
}));

const appKitMock = vi.hoisted(() => ({
  createAppKit: vi.fn(() => appKitInstance),
}));

const wagmiConfigMock = vi.hoisted(() => ({
  value: { config: { id: 'wagmi-config' }, adapter: { id: 'adapter' } },
}));

const bridgeMock = vi.hoisted(() => ({
  applyAccountChange: vi.fn(),
  reset: vi.fn(),
  hasPersistedConnection: vi.fn(() => false),
}));

const state = vi.hoisted(() => ({
  connectWallet: {
    isEnabled: true,
    connectorType: 'reown',
    reown: { projectId: 'test-project', featuredWalletIds: [] as Array<string> },
  } as { isEnabled: boolean; connectorType?: string; reown?: { projectId: string; featuredWalletIds: Array<string> } },
}));

vi.mock('@wagmi/core', () => coreMock);
vi.mock('@reown/appkit/react', () => appKitMock);
vi.mock('./wagmi-config', () => ({ 'default': wagmiConfigMock.value }));
vi.mock('./chains', () => ({ chains: [ { id: 1 } ] }));
vi.mock('./bridge', () => bridgeMock);

vi.mock('src/config', () => ({
  'default': {
    features: {
      get connectWallet() {
        return state.connectWallet;
      },
    },
    chain: { name: 'Test Chain', icon: { 'default': 'icon.png' } },
    app: { baseUrl: 'https://test.explorer' },
  },
}));

// theme foundations are only read to build the AppKit theme variables; mock them so the spec's minimal
// `src/config` doesn't have to satisfy the full theme graph
vi.mock('src/toolkit/theme/foundations/colors', () => ({ 'default': { blue: { '600': { value: '#0000ff' } } } }));
vi.mock('src/toolkit/theme/foundations/typography', () => ({ BODY_TYPEFACE: 'Inter' }));
vi.mock('src/toolkit/theme/foundations/zIndex', () => ({ 'default': { modal2: { value: 1400 } } }));

async function importRuntime() {
  return import('./runtime');
}

describe('connect-wallet runtime', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.resetAllMocks();
    coreMock.hydrate.mockReturnValue({ onMount: hydrateOnMount });
    coreMock.watchAccount.mockReturnValue(() => {});
    coreMock.getAccount.mockReturnValue({ address: undefined, status: 'disconnected' });
    coreMock.disconnect.mockResolvedValue(undefined);
    coreMock.signMessage.mockResolvedValue('0xSignature');
    coreMock.switchChain.mockResolvedValue({ id: 1 });
    appKitMock.createAppKit.mockReturnValue(appKitInstance);
    appKitInstance.subscribeState.mockReturnValue(() => {});
    bridgeMock.hasPersistedConnection.mockReturnValue(false);
    state.connectWallet = {
      isEnabled: true,
      connectorType: 'reown',
      reown: { projectId: 'test-project', featuredWalletIds: [] },
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('reown mode', () => {
    it('builds the AppKit singleton, hydrates + reconnects, and subscribes watchAccount', async() => {
      const { getWeb3Runtime } = await importRuntime();
      const runtime = await getWeb3Runtime();

      expect(runtime.isReady).toBe(true);
      expect(runtime.config).toBe(wagmiConfigMock.value.config);

      expect(appKitMock.createAppKit).toHaveBeenCalledTimes(1);
      expect(appKitMock.createAppKit).toHaveBeenCalledWith(expect.objectContaining({
        projectId: 'test-project',
        allowUnsupportedChain: true,
      }));

      // hydrate(config, { reconnectOnMount: true }).onMount() — what wagmi's <Hydrate> does today
      expect(coreMock.hydrate).toHaveBeenCalledWith(wagmiConfigMock.value.config, { reconnectOnMount: true });
      expect(hydrateOnMount).toHaveBeenCalledTimes(1);

      expect(coreMock.watchAccount).toHaveBeenCalledTimes(1);
    });

    it('is single-flight: repeated calls share one load', async() => {
      const { getWeb3Runtime, ensureLoaded } = await importRuntime();
      const [ a, b ] = await Promise.all([ getWeb3Runtime(), getWeb3Runtime() ]);
      const c = await ensureLoaded();

      expect(a).toBe(b);
      expect(c).toBe(a);
      expect(appKitMock.createAppKit).toHaveBeenCalledTimes(1);
      expect(coreMock.watchAccount).toHaveBeenCalledTimes(1);
    });

    it('propagates watchAccount changes into the bridge', async() => {
      let captured: OnChange | undefined;
      coreMock.watchAccount.mockImplementation((...args) => {
        captured = args[1].onChange;
        return () => {};
      });

      const { getWeb3Runtime } = await importRuntime();
      await getWeb3Runtime();

      const data = { address: '0x1', status: 'connected' };
      const prevData = { address: undefined, status: 'reconnecting' };
      captured?.(data, prevData);

      expect(bridgeMock.applyAccountChange).toHaveBeenCalledWith(data, prevData);
    });

    it('binds actions to the wagmi config', async() => {
      const { getWeb3Runtime } = await importRuntime();
      const runtime = await getWeb3Runtime();

      await runtime.signMessage({ message: 'hi' });
      expect(coreMock.signMessage).toHaveBeenCalledWith(wagmiConfigMock.value.config, { message: 'hi' });

      await runtime.switchChain({ chainId: 1 });
      expect(coreMock.switchChain).toHaveBeenCalledWith(wagmiConfigMock.value.config, { chainId: 1 });

      await runtime.disconnect();
      expect(coreMock.disconnect).toHaveBeenCalledWith(wagmiConfigMock.value.config, undefined);
    });

    it('drives the AppKit modal controls', async() => {
      let stateCb: ModalStateCb | undefined;
      appKitInstance.subscribeState.mockImplementation((...args) => {
        stateCb = args[0];
        return () => {};
      });

      const { getWeb3Runtime } = await importRuntime();
      const runtime = await getWeb3Runtime();

      runtime.openModal();
      expect(appKitInstance.open).toHaveBeenCalledTimes(1);

      const cb = vi.fn();
      runtime.subscribeModalState(cb);
      stateCb?.({ open: true });
      expect(cb).toHaveBeenCalledWith(true);

      runtime.setThemeMode('dark');
      expect(appKitInstance.setThemeMode).toHaveBeenCalledWith('dark');
    });
  });

  describe('fallback mode', () => {
    it('loads the wagmi config without AppKit when the wallet is disabled', async() => {
      state.connectWallet = { isEnabled: false };
      const { getWeb3Runtime } = await importRuntime();
      const runtime = await getWeb3Runtime();

      expect(runtime.isReady).toBe(true);
      expect(runtime.config).toBe(wagmiConfigMock.value.config);
      expect(appKitMock.createAppKit).not.toHaveBeenCalled();
      // modal controls are inert without an AppKit instance
      expect(() => runtime.openModal()).not.toThrow();
    });
  });

  describe('load-failure degradation', () => {
    it('resolves to a disabled runtime, resets the bridge, and rejects actions', async() => {
      coreMock.hydrate.mockImplementation(() => {
        throw new Error('chunk load failed');
      });
      const { getWeb3Runtime, Web3RuntimeUnavailableError } = await importRuntime();
      const runtime = await getWeb3Runtime();

      expect(runtime.isReady).toBe(false);
      expect(runtime.config).toBeUndefined();
      expect(bridgeMock.reset).toHaveBeenCalledTimes(1);
      await expect(runtime.signMessage({ message: 'hi' })).rejects.toBeInstanceOf(Web3RuntimeUnavailableError);
    });
  });

  describe('startWeb3Runtime', () => {
    it('loads eagerly when a connection is persisted', async() => {
      bridgeMock.hasPersistedConnection.mockReturnValue(true);
      const { startWeb3Runtime, getWeb3Runtime } = await importRuntime();
      startWeb3Runtime();
      // startWeb3Runtime fired the single-flight load; await it to let the load chain settle
      await getWeb3Runtime();
      expect(bridgeMock.hasPersistedConnection).toHaveBeenCalled();
      expect(coreMock.watchAccount).toHaveBeenCalledTimes(1);
    });

    it('defers to an idle slot when no connection is persisted', async() => {
      bridgeMock.hasPersistedConnection.mockReturnValue(false);
      const idleSpy = vi.fn((cb: () => void) => {
        cb();
        return 1;
      });
      vi.stubGlobal('requestIdleCallback', idleSpy);
      const { startWeb3Runtime, getWeb3Runtime } = await importRuntime();
      startWeb3Runtime();
      expect(idleSpy).toHaveBeenCalledTimes(1);
      await getWeb3Runtime();
      expect(coreMock.watchAccount).toHaveBeenCalledTimes(1);
      vi.unstubAllGlobals();
    });
  });
});
