// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

type ModalStateCb = (state: { open: boolean }) => void;

// wagmi's imperative actions the runtime binds to the config. The provider (`<WagmiProvider>`) owns
// hydration/reconnection now, so the runtime no longer touches `hydrate`/`watchAccount` — it only prepares
// the config + AppKit and exposes these actions for boot-time consumers that call before a provider exists.
const actionsMock = vi.hoisted(() => ({
  disconnect: vi.fn<() => Promise<void>>(),
  signMessage: vi.fn<() => Promise<string>>(),
  switchChain: vi.fn<() => Promise<{ id: number }>>(),
}));

const appKitInstance = vi.hoisted(() => ({
  open: vi.fn<() => Promise<void>>(),
  subscribeState: vi.fn<(cb: ModalStateCb) => () => void>(),
  setThemeMode: vi.fn(),
  ready: vi.fn<() => Promise<void>>(),
}));

const appKitMock = vi.hoisted(() => ({
  createAppKit: vi.fn(() => appKitInstance),
}));

const wagmiConfigMock = vi.hoisted(() => ({
  shouldThrow: false,
  config: { id: 'wagmi-config' } as unknown,
  adapter: { id: 'adapter' } as unknown,
}));

const state = vi.hoisted(() => ({
  connectWallet: {
    isEnabled: true,
    connectorType: 'reown',
    reown: { projectId: 'test-project', featuredWalletIds: [] as Array<string> },
  } as { isEnabled: boolean; connectorType?: string; reown?: { projectId: string; featuredWalletIds: Array<string> } },
}));

vi.mock('wagmi/actions', () => actionsMock);
vi.mock('@reown/appkit/react', () => appKitMock);
vi.mock('./wagmi-config', () => ({
  // a getter so the load-failure test can simulate a chunk that throws on import
  get 'default'() {
    if (wagmiConfigMock.shouldThrow) {
      throw new Error('chunk load failed');
    }
    return { config: wagmiConfigMock.config, adapter: wagmiConfigMock.adapter };
  },
}));
vi.mock('./chains', () => ({ chains: [ { id: 1 } ] }));

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
    actionsMock.disconnect.mockResolvedValue(undefined);
    actionsMock.signMessage.mockResolvedValue('0xSignature');
    actionsMock.switchChain.mockResolvedValue({ id: 1 });
    appKitMock.createAppKit.mockReturnValue(appKitInstance);
    appKitInstance.open.mockResolvedValue(undefined);
    appKitInstance.subscribeState.mockReturnValue(() => {});
    appKitInstance.ready.mockResolvedValue(undefined);
    wagmiConfigMock.shouldThrow = false;
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
    it('builds the AppKit singleton and waits for it to be ready before handing back the config', async() => {
      const { getWeb3Runtime } = await importRuntime();
      const runtime = await getWeb3Runtime();

      expect(runtime.isReady).toBe(true);
      expect(runtime.config).toBe(wagmiConfigMock.config);

      expect(appKitMock.createAppKit).toHaveBeenCalledTimes(1);
      expect(appKitMock.createAppKit).toHaveBeenCalledWith(expect.objectContaining({
        projectId: 'test-project',
        allowUnsupportedChain: true,
      }));

      // AppKit's connectors must be registered before `<WagmiProvider>` mounts and reconnects, otherwise
      // wagmi's reconnect reads a not-yet-registered connector and throws.
      expect(appKitInstance.ready).toHaveBeenCalledTimes(1);
    });

    it('is single-flight: repeated calls share one load', async() => {
      const { getWeb3Runtime, ensureLoaded } = await importRuntime();
      const [ a, b ] = await Promise.all([ getWeb3Runtime(), getWeb3Runtime() ]);
      const c = await ensureLoaded();

      expect(a).toBe(b);
      expect(c).toBe(a);
      expect(appKitMock.createAppKit).toHaveBeenCalledTimes(1);
    });

    it('binds actions to the wagmi config', async() => {
      const { getWeb3Runtime } = await importRuntime();
      const runtime = await getWeb3Runtime();

      await runtime.signMessage({ message: 'hi' });
      expect(actionsMock.signMessage).toHaveBeenCalledWith(wagmiConfigMock.config, { message: 'hi' });

      await runtime.switchChain({ chainId: 1 });
      expect(actionsMock.switchChain).toHaveBeenCalledWith(wagmiConfigMock.config, { chainId: 1 });

      await runtime.disconnect();
      expect(actionsMock.disconnect).toHaveBeenCalledWith(wagmiConfigMock.config, undefined);
    });

    it('drives the AppKit modal controls', async() => {
      let stateCb: ModalStateCb | undefined;
      appKitInstance.subscribeState.mockImplementation((cb) => {
        stateCb = cb;
        return () => {};
      });

      const { getWeb3Runtime } = await importRuntime();
      const runtime = await getWeb3Runtime();

      await runtime.openModal();
      expect(appKitInstance.open).toHaveBeenCalledTimes(1);

      const cb = vi.fn();
      runtime.subscribeModalState(cb);
      stateCb?.({ open: true });
      expect(cb).toHaveBeenCalledWith(true);

      runtime.setThemeMode('dark');
      expect(appKitInstance.setThemeMode).toHaveBeenCalledWith('dark');
    });

    it('still loads a usable config when AppKit creation throws (modal optional)', async() => {
      appKitMock.createAppKit.mockImplementation(() => {
        throw new Error('appkit boom');
      });

      const { getWeb3Runtime } = await importRuntime();
      const runtime = await getWeb3Runtime();

      expect(runtime.isReady).toBe(true);
      expect(runtime.config).toBe(wagmiConfigMock.config);
      // modal controls are inert without an AppKit instance, but must not throw
      await expect(runtime.openModal()).resolves.toBeUndefined();
      expect(() => runtime.setThemeMode('dark')).not.toThrow();
    });
  });

  describe('fallback mode', () => {
    it('loads the wagmi config without AppKit when the wallet is disabled', async() => {
      state.connectWallet = { isEnabled: false };
      const { getWeb3Runtime } = await importRuntime();
      const runtime = await getWeb3Runtime();

      expect(runtime.isReady).toBe(true);
      expect(runtime.config).toBe(wagmiConfigMock.config);
      expect(appKitMock.createAppKit).not.toHaveBeenCalled();
      await expect(runtime.openModal()).resolves.toBeUndefined();
    });
  });

  describe('dynamic mode', () => {
    it('exposes config + actions without building AppKit (DynamicProvider owns the provider)', async() => {
      state.connectWallet = { isEnabled: true, connectorType: 'dynamic' };
      const { getWeb3Runtime } = await importRuntime();
      const runtime = await getWeb3Runtime();

      expect(runtime.isReady).toBe(true);
      expect(runtime.config).toBe(wagmiConfigMock.config);
      expect(appKitMock.createAppKit).not.toHaveBeenCalled();
      // actions stay bound to the config for the shared signing consumers (rewards, sign-in, verification)
      await runtime.signMessage({ message: 'hi' });
      expect(actionsMock.signMessage).toHaveBeenCalledWith(wagmiConfigMock.config, { message: 'hi' });
    });
  });

  describe('load-failure degradation', () => {
    it('resolves to a disabled runtime whose actions reject', async() => {
      wagmiConfigMock.shouldThrow = true;
      const { getWeb3Runtime, Web3RuntimeUnavailableError } = await importRuntime();
      const runtime = await getWeb3Runtime();

      expect(runtime.isReady).toBe(false);
      expect(runtime.config).toBeUndefined();
      await expect(runtime.openModal()).resolves.toBeUndefined();
      await expect(runtime.signMessage({ message: 'hi' })).rejects.toBeInstanceOf(Web3RuntimeUnavailableError);
    });
  });

  describe('subscribeRuntimeLoaded / getLoadedRuntime', () => {
    it('does not start the load, and fires the subscriber once the load resolves', async() => {
      const { subscribeRuntimeLoaded, getLoadedRuntime, getWeb3Runtime } = await importRuntime();

      const observed = vi.fn();
      subscribeRuntimeLoaded(observed);
      // observing alone must not trigger a load
      expect(appKitMock.createAppKit).not.toHaveBeenCalled();
      expect(getLoadedRuntime()).toBeUndefined();

      const runtime = await getWeb3Runtime();
      expect(observed).toHaveBeenCalledTimes(1);
      expect(observed).toHaveBeenCalledWith(runtime);
      expect(getLoadedRuntime()).toBe(runtime);
    });

    it('fires immediately when the runtime is already loaded', async() => {
      const { subscribeRuntimeLoaded, getWeb3Runtime } = await importRuntime();
      const runtime = await getWeb3Runtime();

      const observed = vi.fn();
      const unsubscribe = subscribeRuntimeLoaded(observed);
      expect(observed).toHaveBeenCalledWith(runtime);
      expect(() => unsubscribe()).not.toThrow();
    });

    it('does not fire a subscriber that unsubscribed before the load resolved', async() => {
      const { subscribeRuntimeLoaded, getWeb3Runtime } = await importRuntime();

      const observed = vi.fn();
      const unsubscribe = subscribeRuntimeLoaded(observed);
      unsubscribe();

      await getWeb3Runtime();
      expect(observed).not.toHaveBeenCalled();
    });
  });

  describe('applyThemeMode', () => {
    it('applies the recorded color mode to AppKit once the runtime loads', async() => {
      const { applyThemeMode, getWeb3Runtime } = await importRuntime();
      applyThemeMode('dark');
      // nothing to apply to yet — the runtime (and its AppKit modal) has not loaded
      expect(appKitInstance.setThemeMode).not.toHaveBeenCalled();

      await getWeb3Runtime();
      expect(appKitInstance.setThemeMode).toHaveBeenCalledWith('dark');
    });

    it('does not trigger a runtime load on its own', async() => {
      const { applyThemeMode } = await importRuntime();
      applyThemeMode('dark');
      expect(appKitMock.createAppKit).not.toHaveBeenCalled();
    });

    it('applies live once the runtime is loaded', async() => {
      const { applyThemeMode, getWeb3Runtime } = await importRuntime();
      await getWeb3Runtime();
      appKitInstance.setThemeMode.mockClear();

      applyThemeMode('light');
      expect(appKitInstance.setThemeMode).toHaveBeenCalledWith('light');
    });
  });
});
