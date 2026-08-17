// SPDX-License-Identifier: LicenseRef-Blockscout

import type { ApiResource } from '../../types';

export const CORE_API_V1_RESOURCES = {
  graphql: {
    path: '/api/v1/graphql',
  },
} satisfies Record<string, ApiResource>;

export type CoreApiV1ResourceName = `core:${ keyof typeof CORE_API_V1_RESOURCES }`;
