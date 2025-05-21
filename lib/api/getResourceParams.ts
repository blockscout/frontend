import type { ApiName, ApiResource } from './types';
import type { SubchainConfig } from 'types/multichain';

import config from 'configs/app';

import type { ResourceName } from './resources';
import { RESOURCES } from './resources';

export default function getResourceParams(resourceFullName: ResourceName, subchain?: SubchainConfig) {
  const [ apiName, resourceName ] = resourceFullName.split(':') as [ ApiName, string ];

  const apiConfig = (() => {
    if (subchain) {
      switch (apiName) {
        case 'general':
          return subchain.apis.general;
      }
    }

    return config.apis[apiName];
  })();

  if (!apiConfig) {
    throw new Error(`API config for ${ apiName } not found`);
  }

  return {
    api: apiConfig,
    apiName,
    resource: RESOURCES[apiName][resourceName as keyof typeof RESOURCES[ApiName]] as ApiResource,
  };
}
