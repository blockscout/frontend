// SPDX-License-Identifier: LicenseRef-Blockscout

import * as v from 'valibot';

import { envBoolean, envUrl, requires } from '../../utils';

export const userOpsSchema = v.pipe(
  v.looseObject({
    NEXT_PUBLIC_HAS_USER_OPS: v.optional(envBoolean()),
    NEXT_PUBLIC_USER_OPS_INDEXER_API_HOST: v.optional(envUrl()),
  }),
  requires('NEXT_PUBLIC_USER_OPS_INDEXER_API_HOST', 'NEXT_PUBLIC_HAS_USER_OPS', {
    message: 'NEXT_PUBLIC_USER_OPS_INDEXER_API_HOST can only be used if NEXT_PUBLIC_HAS_USER_OPS is set to \'true\'',
  }),
);
