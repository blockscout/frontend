// SPDX-License-Identifier: LicenseRef-Blockscout

import type { ApiResource } from '../../types';
import type { BlockCountdownResponse } from 'src/slices/block/types/api';

export const CORE_API_V1_RESOURCES = {
  graphql: {
    path: '/api/v1/graphql',
  },
  block_countdown: {
    path: '/api',
  },
} satisfies Record<string, ApiResource>;

export type CoreApiV1ResourceName = `core:${ keyof typeof CORE_API_V1_RESOURCES }`;

/* eslint-disable @stylistic/indent */
export type CoreApiV1ResourcePayload<R extends CoreApiV1ResourceName> =
R extends 'core:block_countdown' ? BlockCountdownResponse :
never;
/* eslint-enable @stylistic/indent */
