import type { ApiName, ApiResource } from './types';
import type { ChainConfig } from 'types/multichain';

import config from 'configs/app';

import type { ResourceName } from './resources';
import { RESOURCES } from './resources';

export default function getResourceParams(resourceFullName: ResourceName, chain?: ChainConfig) {
  const [ apiName, resourceName ] = resourceFullName.split(':') as [ ApiName, string ];

  const apiConfig = (() => {
    if (chain) {
      return chain.config.apis[apiName];
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
