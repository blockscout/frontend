// SPDX-License-Identifier: LicenseRef-Blockscout

import type { ApiName } from '../types';
import type { ExternalChainExtended } from 'src/shared/external-chains/types';

import config from 'src/config';

import type { ResourceName } from '../resources';
import { getResource } from './get-resource';

export default function getResourceParams(resourceFullName: ResourceName, chain?: ExternalChainExtended) {
  const [ apiName ] = resourceFullName.split(':') as [ ApiName, string ];

  const apiConfig = (() => {
    if (chain?.app_config?.apis) {
      return chain.app_config.apis[apiName as keyof typeof chain.app_config.apis];
    }

    return config.apis[apiName];
  })();

  if (!apiConfig) {
    throw new Error(`API config for ${ apiName } not found`);
  }

  return {
    api: apiConfig,
    apiName,
    resource: getResource(resourceFullName),
  };
}
