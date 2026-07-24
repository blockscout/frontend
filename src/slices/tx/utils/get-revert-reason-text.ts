// SPDX-License-Identifier: LicenseRef-Blockscout

import type { schemas } from '@blockscout/api-types';

export default function getRevertReasonText(data: NonNullable<schemas['Transaction']['revert_reason']> | null) {
  if (!data) {
    return;
  }

  if ('parameters' in data) {
    const reasonParam = data.parameters.find((param) => param.name === 'reason');
    if (typeof reasonParam?.value === 'string') {
      return reasonParam.value;
    }
  }
}
