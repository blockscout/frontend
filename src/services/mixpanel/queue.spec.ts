import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mixpanelMock = vi.hoisted(() => ({
  init: vi.fn(),
  track: vi.fn(),
  register: vi.fn(),
  identify: vi.fn(),
  people: {
    set: vi.fn(),
    set_once: vi.fn(),
    increment: vi.fn(),
  },
  reset: vi.fn(),
}));

const mockState = vi.hoisted(() => ({
  projectToken: 'test-token' as string | undefined,
}));

vi.mock('mixpanel-browser', () => ({ 'default': mixpanelMock }));

vi.mock('src/config', () => ({
  'default': {
    services: {
      get mixpanel() {
        return { projectToken: mockState.projectToken };
      },
    },
  },
}));

const PROJECT_TOKEN = 'test-token';
const CALL_TIME_MS = 1_752_600_000_000;
const CALL_TIME_S = CALL_TIME_MS / 1_000;
const QUEUE_CAP = 100;

const NOOP_SETUP = () => {};

// the module keeps its state (buffer, init promise) at module scope, so every test
// imports a fresh copy
async function importQueue() {
  return await import('./queue');
}

describe('mixpanel queue', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.resetAllMocks();
    mockState.projectToken = PROJECT_TOKEN;
    vi.spyOn(Date, 'now').mockReturnValue(CALL_TIME_MS);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('before init', () => {
    it('should buffer calls and flush them only after setup has run', async() => {
      const queue = await importQueue();
      const order: Array<string> = [];
      mixpanelMock.register.mockImplementation(() => order.push('register'));
      mixpanelMock.identify.mockImplementation(() => order.push('identify'));
      mixpanelMock.track.mockImplementation((event: string) => order.push(`track:${ event }`));
      mixpanelMock.people.set.mockImplementation(() => order.push('people.set'));

      queue.track('Button click', { Content: 'burger menu' });
      queue.peopleSet({ 'With Account': true });
      expect(mixpanelMock.track).not.toHaveBeenCalled();

      const isReady = await queue.init(PROJECT_TOKEN, { persistence: 'localStorage' }, (mixpanel) => {
        mixpanel.register({ 'Chain id': '1' });
        mixpanel.identify('test-uuid');
      });

      expect(isReady).toBe(true);
      expect(mixpanelMock.init).toHaveBeenCalledWith(PROJECT_TOKEN, { persistence: 'localStorage' });
      expect(order).toEqual([ 'register', 'identify', 'track:Button click', 'people.set' ]);
    });

    it('should replay a buffered event with its original call time', async() => {
      const queue = await importQueue();

      queue.track('Button click', { Content: 'burger menu' });
      await queue.init(PROJECT_TOKEN, {}, NOOP_SETUP);

      expect(mixpanelMock.track).toHaveBeenCalledWith(
        'Button click',
        { time: CALL_TIME_S, Content: 'burger menu' },
        undefined,
        undefined,
      );
    });

    it('should keep a caller-provided time property on replay', async() => {
      const queue = await importQueue();
      const customTime = 1_600_000_000;

      queue.track('Button click', { time: customTime });
      await queue.init(PROJECT_TOKEN, {}, NOOP_SETUP);

      expect(mixpanelMock.track).toHaveBeenCalledWith('Button click', { time: customTime }, undefined, undefined);
    });

    it('should buffer and flush people and reset calls', async() => {
      const queue = await importQueue();

      queue.peopleSetOnce({ 'First Time Join': '2026-07-16' });
      queue.peopleIncrement({ Visits: 1 });
      queue.reset();
      await queue.init(PROJECT_TOKEN, {}, NOOP_SETUP);

      expect(mixpanelMock.people.set_once).toHaveBeenCalledWith({ 'First Time Join': '2026-07-16' });
      expect(mixpanelMock.people.increment).toHaveBeenCalledWith({ Visits: 1 });
      expect(mixpanelMock.reset).toHaveBeenCalledOnce();
    });

    it('should flush buffered calls of different types in call order', async() => {
      const queue = await importQueue();
      const order: Array<string> = [];
      mixpanelMock.track.mockImplementation((_event: string, props?: { Content?: string }) => order.push(`track:${ props?.Content }`));
      mixpanelMock.reset.mockImplementation(() => order.push('reset'));

      queue.track('Button click', { Content: 'before logout' });
      queue.reset();
      queue.track('Button click', { Content: 'after logout' });
      await queue.init(PROJECT_TOKEN, {}, NOOP_SETUP);

      expect(order).toEqual([ 'track:before logout', 'reset', 'track:after logout' ]);
    });

    it('should preserve request options and callback on replay', async() => {
      const queue = await importQueue();
      const callback = vi.fn();

      queue.track('Account access', { Action: 'Logged out' }, { send_immediately: true }, callback);
      await queue.init(PROJECT_TOKEN, {}, NOOP_SETUP);

      expect(mixpanelMock.track).toHaveBeenCalledWith(
        'Account access',
        { time: CALL_TIME_S, Action: 'Logged out' },
        { send_immediately: true },
        callback,
      );
    });

    it('should run setup (identity and profile writes) before a buffered reset', async() => {
      const queue = await importQueue();
      const order: Array<string> = [];
      mixpanelMock.people.set.mockImplementation(() => order.push('people.set'));
      mixpanelMock.reset.mockImplementation(() => order.push('reset'));

      queue.reset();
      await queue.init(PROJECT_TOKEN, {}, (mixpanel) => {
        mixpanel.people.set({ 'With Account': true });
      });

      expect(order).toEqual([ 'people.set', 'reset' ]);
    });

    it('should drop calls above the buffer cap', async() => {
      const queue = await importQueue();

      for (let index = 0; index < QUEUE_CAP + 5; index++) {
        queue.track('Button click', { Content: `${ index }` });
      }
      await queue.init(PROJECT_TOKEN, {}, NOOP_SETUP);

      expect(mixpanelMock.track).toHaveBeenCalledTimes(QUEUE_CAP);
    });
  });

  describe('after init', () => {
    it('should pass calls through to the SDK unchanged', async() => {
      const queue = await importQueue();
      await queue.init(PROJECT_TOKEN, {}, NOOP_SETUP);

      queue.track('Button click', { Content: 'burger menu' });
      queue.peopleSet({ 'With Account': true });
      queue.peopleSetOnce({ 'First Time Join': '2026-07-16' });
      queue.peopleIncrement({ Visits: 1 });
      queue.reset();

      expect(mixpanelMock.track).toHaveBeenCalledWith('Button click', { Content: 'burger menu' });
      expect(mixpanelMock.people.set).toHaveBeenCalledWith({ 'With Account': true });
      expect(mixpanelMock.people.set_once).toHaveBeenCalledWith({ 'First Time Join': '2026-07-16' });
      expect(mixpanelMock.people.increment).toHaveBeenCalledWith({ Visits: 1 });
      expect(mixpanelMock.reset).toHaveBeenCalledOnce();
    });

    it('should share a single SDK init between concurrent and repeated init calls', async() => {
      const queue = await importQueue();

      const [ first, second ] = await Promise.all([
        queue.init(PROJECT_TOKEN, {}, NOOP_SETUP),
        queue.init(PROJECT_TOKEN, {}, NOOP_SETUP),
      ]);
      const third = await queue.init(PROJECT_TOKEN, {}, NOOP_SETUP);

      expect(mixpanelMock.init).toHaveBeenCalledOnce();
      expect([ first, second, third ]).toEqual([ true, true, true ]);
    });
  });

  describe('failure handling', () => {
    // a rejected `import('mixpanel-browser')` goes through the same catch as a throwing `init`
    it('should resolve to false, drop the buffer and disable the wrapper when the SDK fails to initialize', async() => {
      mixpanelMock.init.mockImplementation(() => {
        throw new Error('init failed');
      });
      const queue = await importQueue();

      queue.track('Button click', { Content: 'burger menu' });
      const isReady = await queue.init(PROJECT_TOKEN, {}, NOOP_SETUP);

      expect(isReady).toBe(false);
      await expect(queue.init(PROJECT_TOKEN, {}, NOOP_SETUP)).resolves.toBe(false);
      expect(() => queue.track('Button click', { Content: 'burger menu' })).not.toThrow();
      expect(mixpanelMock.track).not.toHaveBeenCalled();
    });

    it('should treat a setup failure as init failure and drop buffered calls', async() => {
      const queue = await importQueue();

      queue.track('Button click', { Content: 'burger menu' });
      const isReady = await queue.init(PROJECT_TOKEN, {}, () => {
        throw new Error('register failed');
      });

      expect(isReady).toBe(false);
      expect(mixpanelMock.track).not.toHaveBeenCalled();
    });
  });

  describe('when the service is disabled', () => {
    it('should ignore every call when the project token is not configured', async() => {
      mockState.projectToken = undefined;
      const queue = await importQueue();

      queue.track('Button click', { Content: 'burger menu' });
      await queue.init(PROJECT_TOKEN, {}, NOOP_SETUP);
      queue.track('Button click', { Content: 'burger menu' });

      expect(mixpanelMock.track).not.toHaveBeenCalled();
    });
  });
});
