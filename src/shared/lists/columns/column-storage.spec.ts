// SPDX-License-Identifier: LicenseRef-Blockscout
// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest';

import { readColumnStorage, subscribeToColumnStorage, writeColumnStorage } from './column-storage';

const KEY = 'table_columns_test';
const OTHER_KEY = 'table_columns_other';

afterEach(() => {
  vi.restoreAllMocks();
  writeColumnStorage(KEY, null);
  writeColumnStorage(OTHER_KEY, null);
});

describe('column storage', () => {
  it('reads back a written value and nothing after it is removed', () => {
    writeColumnStorage(KEY, '{"order":["a"]}');
    expect(readColumnStorage(KEY)).toBe('{"order":["a"]}');
    expect(window.localStorage.getItem(KEY)).toBe('{"order":["a"]}');

    writeColumnStorage(KEY, null);
    expect(readColumnStorage(KEY)).toBeNull();
    expect(window.localStorage.getItem(KEY)).toBeNull();
  });

  it('notifies the subscribers of the written key only', () => {
    const listener = vi.fn();
    const otherListener = vi.fn();
    subscribeToColumnStorage(KEY, listener);
    subscribeToColumnStorage(OTHER_KEY, otherListener);

    writeColumnStorage(KEY, '{}');

    expect(listener).toHaveBeenCalledTimes(1);
    expect(otherListener).not.toHaveBeenCalled();
  });

  it('notifies every subscriber of the same key', () => {
    const first = vi.fn();
    const second = vi.fn();
    subscribeToColumnStorage(KEY, first);
    subscribeToColumnStorage(KEY, second);

    writeColumnStorage(KEY, '{}');

    expect(first).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledTimes(1);
  });

  it('stops notifying after unsubscribe', () => {
    const listener = vi.fn();
    const unsubscribe = subscribeToColumnStorage(KEY, listener);
    unsubscribe();

    writeColumnStorage(KEY, '{}');
    window.dispatchEvent(new StorageEvent('storage', { key: KEY }));

    expect(listener).not.toHaveBeenCalled();
  });

  it('notifies on a change of the key made in another tab, or on a storage clear', () => {
    const listener = vi.fn();
    subscribeToColumnStorage(KEY, listener);

    window.dispatchEvent(new StorageEvent('storage', { key: OTHER_KEY }));
    expect(listener).not.toHaveBeenCalled();

    window.dispatchEvent(new StorageEvent('storage', { key: KEY }));
    window.dispatchEvent(new StorageEvent('storage', { key: null }));
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it('keeps the value for the session when storage refuses the write', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('quota', 'QuotaExceededError');
    });
    const listener = vi.fn();
    subscribeToColumnStorage(KEY, listener);

    writeColumnStorage(KEY, '{"order":["a"]}');

    expect(readColumnStorage(KEY)).toBe('{"order":["a"]}');
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('keeps the removal for the session when storage refuses it', () => {
    writeColumnStorage(KEY, '{}');
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new DOMException('denied', 'SecurityError');
    });

    writeColumnStorage(KEY, null);

    expect(readColumnStorage(KEY)).toBeNull();
  });

  it('reads nothing stored when storage access throws', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('denied', 'SecurityError');
    });

    expect(readColumnStorage(KEY)).toBeNull();
  });

  it('returns to storage once a write succeeds again', () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementationOnce(() => {
      throw new DOMException('quota', 'QuotaExceededError');
    });
    writeColumnStorage(KEY, '{"order":["a"]}');
    setItem.mockRestore();

    writeColumnStorage(KEY, '{"order":["b"]}');
    window.localStorage.setItem(KEY, '{"order":["c"]}');

    expect(readColumnStorage(KEY)).toBe('{"order":["c"]}');
  });
});
