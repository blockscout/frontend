// SPDX-License-Identifier: LicenseRef-Blockscout

import type { ApiResource } from '../types';
import type * as adminRs from '@blockscout/admin-rs-types';

export const ADMIN_API_RESOURCES = {
  public_tag_application: {
    path: '/api/v1/chains/:instanceId/metadata-submissions/tag',
    pathParams: [ 'instanceId' as const ],
  },
  token_info_applications_config: {
    path: '/api/v1/chains/:instanceId/token-info-submissions/selectors',
    pathParams: [ 'instanceId' as const ],
  },
  token_info_applications: {
    path: '/api/v1/chains/:instanceId/token-info-submissions{/:id}',
    pathParams: [ 'instanceId' as const, 'id' as const ],
  },
  marketplace_dapps: {
    path: '/api/v1/chains/:instanceId/marketplace/dapps',
    pathParams: [ 'instanceId' as const ],
  },
  marketplace_dapp: {
    path: '/api/v1/chains/:instanceId/marketplace/dapps/:dappId',
    pathParams: [ 'instanceId' as const, 'dappId' as const ],
  },
  marketplace_rate_dapp: {
    path: '/api/v1/chains/:instanceId/marketplace/dapps/:dappId/ratings',
    pathParams: [ 'instanceId' as const, 'dappId' as const ],
  },
} satisfies Record<string, ApiResource>;

export type AdminApiResourceName = `admin:${ keyof typeof ADMIN_API_RESOURCES }`;

/* eslint-disable @stylistic/indent */
export type AdminApiResourcePayload<R extends AdminApiResourceName> =
R extends 'admin:token_info_applications_config' ? adminRs.ListTokenInfoSubmissionSelectorsResponse :
R extends 'admin:token_info_applications' ? adminRs.ListTokenInfoSubmissionsResponse :
R extends 'admin:marketplace_dapps' ? Array<adminRs.MarketplaceDapp> :
R extends 'admin:marketplace_dapp' ? adminRs.MarketplaceDapp :
never;
/* eslint-enable @stylistic/indent */
