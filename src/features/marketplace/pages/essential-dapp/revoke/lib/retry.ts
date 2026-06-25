// SPDX-License-Identifier: LicenseRef-Blockscout

import { API_RATE_LIMIT_RETRY_COUNT, API_RATE_LIMIT_RETRY_DELAY } from '../constants';
import { isAbortError, isHttp429Error } from './errors';

function throwIfAborted(signal?: AbortSignal) {
  if (signal?.aborted) {
    throw new DOMException('Aborted', 'AbortError');
  }
}

async function sleep(ms: number, signal?: AbortSignal) {
  throwIfAborted(signal);

  await new Promise<void>((resolve, reject) => {
    const onAbort = () => {
      globalThis.clearTimeout(timeout);
      reject(new DOMException('Aborted', 'AbortError'));
    };
    const timeout = globalThis.setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve();
    }, ms);

    signal?.addEventListener('abort', onAbort, { once: true });
  });
}

export async function retryOnHttp429<T>(
  request: () => Promise<T>,
  signal?: AbortSignal,
  retries = API_RATE_LIMIT_RETRY_COUNT,
): Promise<T> {
  let attempt = 0;

  while (true) {
    throwIfAborted(signal);

    try {
      return await request();
    } catch (error) {
      if (isAbortError(error) || !isHttp429Error(error) || attempt >= retries) {
        throw error;
      }

      attempt += 1;
      await sleep(API_RATE_LIMIT_RETRY_DELAY, signal);
    }
  }
}
