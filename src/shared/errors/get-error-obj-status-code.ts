// SPDX-License-Identifier: LicenseRef-Blockscout

import getErrorObj from './get-error-obj';

export default function getErrorObjStatusCode(error: unknown) {
  const errorObj = getErrorObj(error);

  if (!errorObj || !('status' in errorObj) || typeof errorObj.status !== 'number') {
    return;
  }

  return errorObj.status;
}
