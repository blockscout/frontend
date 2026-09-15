// SPDX-License-Identifier: LicenseRef-Blockscout

import type { ApiResource } from '../resources/types';
import type { ApiName } from '../types';

import type { ResourceName } from '../resources';
import { RESOURCES } from '../resources';

export function getResource(resourceFullName: ResourceName): ApiResource {
  const [ apiName, resourceName ] = resourceFullName.split(':') as [ ApiName, keyof typeof RESOURCES[ApiName] ];
  return RESOURCES[apiName][resourceName];
}
