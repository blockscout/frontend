// SPDX-License-Identifier: LicenseRef-Blockscout

import getErrorCauseStatusCode from 'src/shared/errors/get-error-cause-status-code';
import getErrorMessage from 'src/shared/errors/get-error-message';
import getErrorObjStatusCode from 'src/shared/errors/get-error-obj-status-code';
import getErrorProp from 'src/shared/errors/get-error-prop';

export function isAbortError(error: unknown): boolean {
  return getErrorProp<string>(error, 'name') === 'AbortError';
}

export function isHttp429Error(error: unknown): boolean {
  return getErrorObjStatusCode(error) === 429 ||
    (error instanceof Error && getErrorCauseStatusCode(error) === 429);
}

export function shouldRethrowLocalError(error: unknown): boolean {
  return isAbortError(error) || isHttp429Error(error);
}

export function isLogsRangeError(error: unknown): boolean {
  const message = getErrorMessage(error);
  return typeof message === 'string' && /block range|limit exceeded|too many results|response size|query returned/i.test(message);
}

export function shouldRetryRevokeQuery(failureCount: number, error: unknown): boolean {
  if (isAbortError(error) || isHttp429Error(error)) {
    return false;
  }

  return failureCount < 2;
}
