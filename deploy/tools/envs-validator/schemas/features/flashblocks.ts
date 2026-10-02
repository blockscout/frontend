// SPDX-License-Identifier: LicenseRef-Blockscout

import * as v from 'valibot';

import { FLASHBLOCKS_NAMES } from 'src/features/flashblocks/types/config';

import { envUrl, requires } from '../../utils';

export const flashblocksSchema = v.pipe(
  v.object({
    NEXT_PUBLIC_FLASHBLOCKS_SOCKET_URL: v.optional(envUrl()),
    NEXT_PUBLIC_FLASHBLOCKS_NAME: v.optional(v.picklist(FLASHBLOCKS_NAMES)),
  }),
  requires('NEXT_PUBLIC_FLASHBLOCKS_NAME', 'NEXT_PUBLIC_FLASHBLOCKS_SOCKET_URL'),
);
