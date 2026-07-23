// SPDX-License-Identifier: LicenseRef-Blockscout

// Early-fetch primer, consuming side. Pages registered in src/server/primedRequests embed an
// inline script into the HTML document that fires their first-render API requests before the
// JS bundle boots; the fetch layer (useFetch) picks up the primed request here instead of
// hitting the network a second time.
//
// Semantics:
//  - consume-once: an entry is removed from the map on first take, whether it is used or not;
//  - GET only (enforced by the caller);
//  - safety net: if the headers the primer sent differ from the headers the client would
//    send (e.g. the inline script's cookie logic drifted from build-headers.ts), the primed
//    response is discarded and the caller falls back to a normal network request;
//  - AbortSignal: when the caller passes a signal (React Query does), an abort rejects the
//    returned promise like a normal fetch — the in-flight primed request cannot be cancelled,
//    but the consumer must not observe its result after cancel.

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
