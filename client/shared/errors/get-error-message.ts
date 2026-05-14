// SPDX-License-Identifier: LicenseRef-Blockscout

import getErrorObj from './get-error-obj';

export default function getErrorMessage(error: unknown): string | undefined {
  const errorObj = getErrorObj(error);
  return errorObj && 'message' in errorObj && typeof errorObj.message === 'string' ? errorObj.message : undefined;
}
