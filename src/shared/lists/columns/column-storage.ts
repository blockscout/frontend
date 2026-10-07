// SPDX-License-Identifier: LicenseRef-Blockscout

type Listener = () => void;

// Safari private mode and storage-disabled browsers throw on access or on write;
// the session then keeps its values here instead
const memoryStore = new Map<string, string | null>();
const listeners = new Map<string, Set<Listener>>();

function notify(key: string): void {
  listeners.get(key)?.forEach((listener) => listener());
}

export function readColumnStorage(key: string): string | null {
  if (memoryStore.has(key)) {
    return memoryStore.get(key) ?? null;
  }

  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeColumnStorage(key: string, value: string | null): void {
  try {
    if (value === null) {
      window.localStorage.removeItem(key);
    } else {
      window.localStorage.setItem(key, value);
    }
    memoryStore.delete(key);
  } catch {
    memoryStore.set(key, value);
  }
  notify(key);
}

export function subscribeToColumnStorage(key: string, listener: Listener): () => void {
  const keyListeners = listeners.get(key) ?? new Set<Listener>();
  keyListeners.add(listener);
  listeners.set(key, keyListeners);

  const handleStorage = (event: StorageEvent) => {
    if (event.key === key || event.key === null) {
      listener();
    }
  };
  window.addEventListener('storage', handleStorage);

  return () => {
    keyListeners.delete(listener);
    if (keyListeners.size === 0) {
      listeners.delete(key);
    }
    window.removeEventListener('storage', handleStorage);
  };
}
