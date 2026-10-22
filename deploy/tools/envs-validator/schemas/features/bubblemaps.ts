// SPDX-License-Identifier: LicenseRef-Blockscout

import * as v from 'valibot';

import { requires } from '../../utils';

export const bubblemapsSchema = v.pipe(
  v.object({
    NEXT_PUBLIC_BUBBLEMAPS_CHAIN_SLUG: v.optional(v.pipe(v.string(), v.nonEmpty())),
    NEXT_PUBLIC_BUBBLEMAPS_PARTNER_ID: v.optional(v.pipe(v.string(), v.nonEmpty())),
  }),
  requires('NEXT_PUBLIC_BUBBLEMAPS_CHAIN_SLUG', 'NEXT_PUBLIC_BUBBLEMAPS_PARTNER_ID'),
  requires('NEXT_PUBLIC_BUBBLEMAPS_PARTNER_ID', 'NEXT_PUBLIC_BUBBLEMAPS_CHAIN_SLUG'),
);
