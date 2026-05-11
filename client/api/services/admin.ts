import type { ApiResource } from '../types';
import type { TokenInfoApplicationConfig, TokenInfoApplications } from 'types/api/account';
import type { MarketplaceApp } from 'types/client/marketplace';

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
R extends 'admin:token_info_applications_config' ? TokenInfoApplicationConfig :
R extends 'admin:token_info_applications' ? TokenInfoApplications :
R extends 'admin:marketplace_dapps' ? Array<MarketplaceApp> :
R extends 'admin:marketplace_dapp' ? MarketplaceApp :
never;
/* eslint-enable @stylistic/indent */
