import { describe, expect, it } from 'vitest';

import { isAbortError, isHttp429Error, isLogsRangeError, shouldRetryRevokeQuery } from './errors';

describe('revoke error helpers', () => {
  it('detects abort errors', () => {
    expect(isAbortError(new DOMException('Aborted', 'AbortError'))).toBe(true);
  });

  it('detects HTTP 429 errors', () => {
    expect(isHttp429Error({ status: 429 })).toBe(true);
  });

  it('detects logs range errors by message', () => {
    expect(isLogsRangeError(new Error('block range is too large'))).toBe(true);
    expect(isLogsRangeError(new Error('query returned too many results'))).toBe(true);
  });

  it('does not retry abort and HTTP 429 errors', () => {
    expect(shouldRetryRevokeQuery(0, new DOMException('Aborted', 'AbortError'))).toBe(false);
    expect(shouldRetryRevokeQuery(0, { status: 429 })).toBe(false);
  });
});
