// SPDX-License-Identifier: LicenseRef-Blockscout

import * as v from 'valibot';

import { envUrl, requires } from '../../utils';

export const tacSchema = v.pipe(
  v.looseObject({
    NEXT_PUBLIC_TAC_OPERATION_LIFECYCLE_API_HOST: v.optional(envUrl()),
    NEXT_PUBLIC_TAC_TON_EXPLORER_URL: v.optional(envUrl()),
  }),
  requires('NEXT_PUBLIC_TAC_TON_EXPLORER_URL', 'NEXT_PUBLIC_TAC_OPERATION_LIFECYCLE_API_HOST'),
);
