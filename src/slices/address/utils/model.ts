// SPDX-License-Identifier: LicenseRef-Blockscout

import type { schemas } from '@blockscout/api-types';

import { UNKNOWN_ADDRESS } from './consts';

export function toAddressModel(fields: Partial<schemas['Address']>): schemas['Address'] {
  return {
    ...UNKNOWN_ADDRESS,
    ...fields,
    hash: fields.hash ?? '',
  };
}
