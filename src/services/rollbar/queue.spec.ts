/** @vitest-environment jsdom */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const rollbarInstance = vi.hoisted(() => ({
  warn: vi.fn(),
  error: vi.fn(),
  critical: vi.fn(),
}));

const RollbarMock = vi.hoisted(() => vi.fn(function Rollbar() {
  return rollbarInstance;
}));

const mockState = vi.hoisted(() => ({
  clientToken: 'test-token' as string | undefined,
}));

vi.mock('rollbar', () => ({ 'default': RollbarMock }));

vi.mock('./clientConfig', () => ({
  buildClientConfig: (accessToken: string) => ({ accessToken }),
}));

vi.mock('src/config', () => ({
  'default': {
    services: {
      get rollbar() {
        return { clientToken: mockState.clientToken };
      },
    },
  },
}));

const ACCESS_TOKEN = 'test-token';
const CALL_TIME_MS = 1_752_600_000_000;
const CALL_TIME_S = CALL_TIME_MS / 1_000;
const QUEUE_CAP = 100;

async function importQueue() {
  return await import('./queue');
}

describe('rollbar queue', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.resetAllMocks();
    mockState.clientToken = ACCESS_TOKEN;
    vi.spyOn(Date, 'now').mockReturnValue(CALL_TIME_MS);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('before init', () => {
    it('should buffer calls and flush them after the SDK loads', async() => {
      const queue = await importQueue();

      queue.getClient()?.warn('Client fetch failed', { resource: 'core:stats' });
      queue.getClient()?.critical('Application error', { stack: 'trace' });
      expect(rollbarInstance.warn).not.toHaveBeenCalled();
      expect(rollbarInstance.critical).not.toHaveBeenCalled();

      const isReady = await queue.init();

      expect(isReady).toBe(true);
      expect(RollbarMock).toHaveBeenCalledWith({ accessToken: ACCESS_TOKEN });
      expect(rollbarInstance.warn).toHaveBeenCalledWith(
        'Client fetch failed',
        { client_timestamp: CALL_TIME_S, resource: 'core:stats' },
      );
      expect(rollbarInstance.critical).toHaveBeenCalledWith(
        'Application error',
        { client_timestamp: CALL_TIME_S, stack: 'trace' },
      );
    });

    it('should attach client_timestamp when the buffered call has no custom payload', async() => {
      const queue = await importQueue();

      queue.getClient()?.error('bare message');
      await queue.init();

      expect(rollbarInstance.error).toHaveBeenCalledWith(
        'bare message',
        { client_timestamp: CALL_TIME_S },
      );
    });

    it('should drop calls once the buffer is full', async() => {
      const queue = await importQueue();

      for (let i = 0; i < QUEUE_CAP + 5; i++) {
        queue.getClient()?.warn(`msg-${ i }`);
      }
      await queue.init();

      expect(rollbarInstance.warn).toHaveBeenCalledTimes(QUEUE_CAP);
    });
  });

  describe('after init', () => {
    it('should forward calls straight to the instance', async() => {
      const queue = await importQueue();
      await queue.init();

      queue.getClient()?.error('Test error', { payload: 'foo' });

      expect(rollbarInstance.error).toHaveBeenCalledWith('Test error', { payload: 'foo' });
    });

    it('should share one init across concurrent callers', async() => {
      const queue = await importQueue();

      const [ first, second ] = await Promise.all([ queue.init(), queue.init() ]);

      expect(first).toBe(true);
      expect(second).toBe(true);
      expect(RollbarMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('when disabled', () => {
    it('should return undefined from getClient when there is no token', async() => {
      mockState.clientToken = undefined;
      const queue = await importQueue();

      expect(queue.getClient()).toBeUndefined();
      expect(await queue.init()).toBe(false);
      expect(RollbarMock).not.toHaveBeenCalled();
    });

    it('should disable the client and remove early listeners after a chunk-load failure', async() => {
      RollbarMock.mockImplementationOnce(() => {
        throw new Error('chunk load failed');
      });
      const queue = await importQueue();

      const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
      queue.installEarlyListeners();
      const errorHandler = addEventListenerSpy.mock.calls.find((call) => call[0] === 'error')?.[1];
      addEventListenerSpy.mockRestore();

      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

      queue.getClient()?.warn('pre-fail');
      expect(await queue.init()).toBe(false);

      expect(queue.getClient()).toBeUndefined();
      queue.getClient()?.warn('post-fail');
      expect(rollbarInstance.warn).not.toHaveBeenCalled();
      expect(errorHandler).toBeTypeOf('function');
      expect(removeEventListenerSpy).toHaveBeenCalledWith('error', errorHandler, true);
    });
  });

  describe('early listeners', () => {
    it('should buffer window error events until init', async() => {
      const queue = await importQueue();
      const remove = queue.installEarlyListeners();
      const uncaught = new Error('uncaught boom');

      window.dispatchEvent(new ErrorEvent('error', { message: 'uncaught boom', error: uncaught }));
      expect(rollbarInstance.error).not.toHaveBeenCalled();

      await queue.init();

      expect(rollbarInstance.error).toHaveBeenCalledWith(
        uncaught,
        { client_timestamp: CALL_TIME_S },
      );

      remove();
    });

    it('should report a non-Error thrown value under a fallback message with the value as custom data', async() => {
      const queue = await importQueue();
      const remove = queue.installEarlyListeners();
      // A synchronous `throw` of a non-Error value would otherwise reach Rollbar as a bare object
      // and be filed as a generic "null or missing arguments." item (issue #3566, subtask 3).
      const thrown = { code: 'BOOM' };

      window.dispatchEvent(new ErrorEvent('error', { message: 'Uncaught object', error: thrown }));
      await queue.init();

      expect(rollbarInstance.error).toHaveBeenCalledWith(
        'Uncaught object',
        { client_timestamp: CALL_TIME_S, error: thrown },
      );

      remove();
    });

    it('should fall back to the event message when there is no error object', async() => {
      const queue = await importQueue();
      const remove = queue.installEarlyListeners();

      window.dispatchEvent(new ErrorEvent('error', { message: 'Script error.', error: null }));
      await queue.init();

      expect(rollbarInstance.error).toHaveBeenCalledWith(
        'Script error.',
        { client_timestamp: CALL_TIME_S },
      );

      remove();
    });

    it('should ignore resource load error events', async() => {
      const queue = await importQueue();
      const remove = queue.installEarlyListeners();
      const img = document.createElement('img');
      document.body.appendChild(img);

      img.dispatchEvent(new ErrorEvent('error', { message: '', error: null }));
      await queue.init();

      expect(rollbarInstance.error).not.toHaveBeenCalled();

      remove();
      img.remove();
    });
  });
});
