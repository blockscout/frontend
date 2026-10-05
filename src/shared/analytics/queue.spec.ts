import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { AnalyticsProvider } from './provider';

const registry = vi.hoisted(() => ({
  enabledProviders: [] as Array<unknown>,
}));

vi.mock('./providers', () => ({
  getEnabledProviders: () => registry.enabledProviders,
}));

const CALL_TIME_MS = 1_752_600_000_000;
const QUEUE_CAP = 100;
const NO_DEBUG = { debug: false };

const NOOP_SETUP = () => {};

interface FakeProvider extends AnalyticsProvider {
  readonly calls: Array<string>;
  readonly track: ReturnType<typeof vi.fn<AnalyticsProvider['track']>>;
  readonly init: ReturnType<typeof vi.fn<AnalyticsProvider['init']>>;
}

function createFakeProvider(): FakeProvider {
  const calls: Array<string> = [];
  return {
    calls,
    init: vi.fn<AnalyticsProvider['init']>(async() => {}),
    track: vi.fn<AnalyticsProvider['track']>((event, properties) => {
      calls.push(`track:${ event }:${ properties?.Content }`);
    }),
    register: () => calls.push('register'),
    identify: (distinctId) => calls.push(`identify:${ distinctId }`),
    peopleSet: () => calls.push('peopleSet'),
    peopleSetOnce: () => calls.push('peopleSetOnce'),
    reset: () => calls.push('reset'),
  };
}

function entries(...providers: Array<AnalyticsProvider>) {
  return providers.map((provider) => ({ provider, options: NO_DEBUG }));
}

// the module keeps its state (buffer, init promise, live providers) at module scope, so every
// test imports a fresh copy
async function importQueue() {
  return await import('./queue');
}

describe('analytics queue', () => {
  let first: FakeProvider;
  let second: FakeProvider;

  beforeEach(() => {
    vi.resetModules();
    first = createFakeProvider();
    second = createFakeProvider();
    registry.enabledProviders = [ first, second ];
    vi.spyOn(Date, 'now').mockReturnValue(CALL_TIME_MS);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('before init', () => {
    it('should buffer calls and replay them into every provider only after its setup has run', async() => {
      const queue = await importQueue();

      queue.track('Button click', { Content: 'burger menu' });
      queue.peopleSet({ 'With Account': true });
      expect(first.calls).toEqual([]);

      const isReady = await queue.init(entries(first, second), (provider) => {
        provider.register({ 'Chain id': '1' });
        provider.identify('test-uuid');
      });

      expect(isReady).toBe(true);
      const expectedCalls = [ 'register', 'identify:test-uuid', 'track:Button click:burger menu', 'peopleSet' ];
      expect(first.calls).toEqual(expectedCalls);
      expect(second.calls).toEqual(expectedCalls);
    });

    it('should pass the init options to each provider', async() => {
      const queue = await importQueue();

      await queue.init([ { provider: first, options: { debug: true } }, { provider: second, options: NO_DEBUG } ], NOOP_SETUP);

      expect(first.init).toHaveBeenCalledWith({ debug: true });
      expect(second.init).toHaveBeenCalledWith({ debug: false });
    });

    it('should replay a buffered event with its original call time', async() => {
      const queue = await importQueue();

      queue.track('Button click', { Content: 'burger menu' });
      await queue.init(entries(first), NOOP_SETUP);

      expect(first.track).toHaveBeenCalledWith('Button click', { Content: 'burger menu' }, { timestamp: CALL_TIME_MS });
    });

    it('should keep the send-immediately option on replay', async() => {
      const queue = await importQueue();

      queue.track('Account access', { Action: 'Logged out' }, { sendImmediately: true });
      await queue.init(entries(first), NOOP_SETUP);

      expect(first.track).toHaveBeenCalledWith(
        'Account access',
        { Action: 'Logged out' },
        { sendImmediately: true, timestamp: CALL_TIME_MS },
      );
    });

    it('should flush buffered calls of different types in call order', async() => {
      const queue = await importQueue();

      queue.track('Button click', { Content: 'before logout' });
      queue.reset();
      queue.peopleSetOnce({ 'First Time Join': '2026-07-16' });
      queue.track('Button click', { Content: 'after logout' });
      await queue.init(entries(first), NOOP_SETUP);

      expect(first.calls).toEqual([ 'track:Button click:before logout', 'reset', 'peopleSetOnce', 'track:Button click:after logout' ]);
    });

    it('should run setup (identity and profile writes) before a reset buffered during the deferral window', async() => {
      const queue = await importQueue();

      queue.reset();
      await queue.init(entries(first, second), (provider) => {
        provider.peopleSet({ 'With Account': true });
      });

      expect(first.calls).toEqual([ 'peopleSet', 'reset' ]);
      expect(second.calls).toEqual([ 'peopleSet', 'reset' ]);
    });

    it('should drop calls above the buffer cap', async() => {
      const queue = await importQueue();

      for (let index = 0; index < QUEUE_CAP + 5; index++) {
        queue.track('Button click', { Content: `${ index }` });
      }
      await queue.init(entries(first), NOOP_SETUP);

      expect(first.track).toHaveBeenCalledTimes(QUEUE_CAP);
      expect(first.calls.at(-1)).toBe(`track:Button click:${ QUEUE_CAP - 1 }`);
    });
  });

  describe('after init', () => {
    it('should pass calls through to every provider without a timestamp', async() => {
      const queue = await importQueue();
      await queue.init(entries(first, second), NOOP_SETUP);

      queue.track('Button click', { Content: 'burger menu' });
      queue.peopleSet({ 'With Account': true });
      queue.peopleSetOnce({ 'First Time Join': '2026-07-16' });
      queue.reset();

      const expectedCalls = [ 'track:Button click:burger menu', 'peopleSet', 'peopleSetOnce', 'reset' ];
      expect(first.calls).toEqual(expectedCalls);
      expect(second.calls).toEqual(expectedCalls);
      expect(first.track).toHaveBeenCalledWith('Button click', { Content: 'burger menu' }, {});
    });

    it('should share a single init between concurrent and repeated init calls', async() => {
      const queue = await importQueue();

      const [ firstResult, secondResult ] = await Promise.all([
        queue.init(entries(first), NOOP_SETUP),
        queue.init(entries(first), NOOP_SETUP),
      ]);
      const thirdResult = await queue.init(entries(first), NOOP_SETUP);

      expect(first.init).toHaveBeenCalledOnce();
      expect([ firstResult, secondResult, thirdResult ]).toEqual([ true, true, true ]);
    });
  });

  describe('enabled providers', () => {
    it('should send calls only to the initialized provider when just one is enabled', async() => {
      registry.enabledProviders = [ first ];
      const queue = await importQueue();

      queue.track('Button click', { Content: 'buffered' });
      await queue.init(entries(first), NOOP_SETUP);
      queue.track('Button click', { Content: 'live' });

      expect(first.calls).toEqual([ 'track:Button click:buffered', 'track:Button click:live' ]);
      expect(second.calls).toEqual([]);
    });

    it('should not buffer anything when no provider is enabled', async() => {
      registry.enabledProviders = [];
      const queue = await importQueue();

      queue.track('Button click', { Content: 'burger menu' });
      queue.peopleSet({ 'With Account': true });
      queue.reset();
      await queue.init(entries(first), NOOP_SETUP);

      expect(first.calls).toEqual([]);
    });

    it('should resolve to false and send nothing when initialized without providers', async() => {
      const queue = await importQueue();

      queue.track('Button click', { Content: 'burger menu' });
      const isReady = await queue.init([], NOOP_SETUP);
      queue.track('Button click', { Content: 'burger menu' });

      expect(isReady).toBe(false);
      expect(first.calls).toEqual([]);
    });
  });

  describe('failure handling', () => {
    it('should drop a provider whose SDK fails to load and still replay the buffer into the others', async() => {
      const consoleError = vi.spyOn(console, 'error');
      first.init.mockRejectedValue(new Error('chunk load failed'));
      const queue = await importQueue();

      queue.track('Button click', { Content: 'buffered' });
      const isReady = await queue.init(entries(first, second), NOOP_SETUP);
      queue.track('Button click', { Content: 'live' });

      expect(isReady).toBe(true);
      expect(first.calls).toEqual([]);
      expect(second.calls).toEqual([ 'track:Button click:buffered', 'track:Button click:live' ]);
      expect(consoleError).not.toHaveBeenCalled();
    });

    it('should drop a provider whose setup throws without affecting the others', async() => {
      const queue = await importQueue();

      queue.track('Button click', { Content: 'buffered' });
      const isReady = await queue.init(entries(first, second), (provider) => {
        if (provider === first) {
          throw new Error('register failed');
        }
      });

      expect(isReady).toBe(true);
      expect(first.calls).toEqual([]);
      expect(second.calls).toEqual([ 'track:Button click:buffered' ]);
    });

    it('should resolve to false, discard the buffer and ignore later calls when every provider fails', async() => {
      first.init.mockRejectedValue(new Error('chunk load failed'));
      second.init.mockRejectedValue(new Error('chunk load failed'));
      const queue = await importQueue();

      queue.track('Button click', { Content: 'buffered' });
      const isReady = await queue.init(entries(first, second), NOOP_SETUP);

      expect(isReady).toBe(false);
      await expect(queue.init(entries(first, second), NOOP_SETUP)).resolves.toBe(false);
      expect(() => queue.track('Button click', { Content: 'live' })).not.toThrow();
      expect(first.calls).toEqual([]);
      expect(second.calls).toEqual([]);
    });
  });
});
