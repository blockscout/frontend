// SPDX-License-Identifier: LicenseRef-Blockscout

import type { ResourceError } from 'client/api/resources';

import getErrorCause from './get-error-cause';

export default function getResourceErrorPayload<Payload = Record<string, unknown> | string>(error: Error | undefined):
ResourceError<Payload>['payload'] | undefined {
  const cause = getErrorCause(error);
  return cause && 'payload' in cause ? cause.payload as ResourceError<Payload>['payload'] : undefined;
}
