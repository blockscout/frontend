// SPDX-License-Identifier: LicenseRef-Blockscout

export function normalizeHeaders(headers: HeadersInit | undefined): string {
  const entries: Array<[ string, string ]> = [];
  new Headers(headers).forEach((value, key) => {
    entries.push([ key, value ]);
  });
  return JSON.stringify(entries.sort(([ a ], [ b ]) => a < b ? -1 : 1));
}

function abortError(signal: AbortSignal): unknown {
  return signal.reason ?? new DOMException('The operation was aborted.', 'AbortError');
}

function withAbortSignal(promise: Promise<Response>, signal: AbortSignal): Promise<Response> {
  if (signal.aborted) {
    return Promise.reject(abortError(signal));
  }

  return new Promise((resolve, reject) => {
    const onAbort = () => {
      reject(abortError(signal));
    };

    signal.addEventListener('abort', onAbort, { once: true });

    promise.then(
      (response) => {
        signal.removeEventListener('abort', onAbort);
        if (signal.aborted) {
          reject(abortError(signal));
          return;
        }
        resolve(response);
      },
      (error) => {
        signal.removeEventListener('abort', onAbort);
        reject(error);
      },
    );
  });
}

// GET requests only. An entry is removed from the map on first take, whether it is used or not.
// Returns undefined, for the caller to fetch as usual, when the url has no entry or the primed
// headers differ from `headers`. An abort of `signal` rejects the returned promise like a normal
// fetch, though the primed request itself cannot be cancelled.
export default function takePrimedFetch(
  url: string,
  headers: HeadersInit | undefined,
  signal?: AbortSignal,
): Promise<Response> | undefined {
  if (typeof window === 'undefined') {
    return;
  }

  const entry = window.__primedFetches?.get(url);
  if (!entry) {
    return;
  }

  window.__primedFetches?.delete(url);

  if (normalizeHeaders(entry.headers) !== normalizeHeaders(headers)) {
    return;
  }

  return signal ? withAbortSignal(entry.promise, signal) : entry.promise;
}
