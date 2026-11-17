// SPDX-License-Identifier: LicenseRef-Blockscout

import * as v from 'valibot';

import { envUrl } from '../../utils';

export const megaEthSchema = v.object({
  NEXT_PUBLIC_MEGA_ETH_SOCKET_URL_METRICS: v.optional(envUrl()),
  NEXT_PUBLIC_MEGA_ETH_SOCKET_URL_RPC: v.optional(envUrl()),
});
