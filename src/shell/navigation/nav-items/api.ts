// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NavItem } from '../types';
import type { NavLocation } from './types';

import config from 'src/config';
import { getFeaturePayload } from 'src/config/utils/features';

export function getApiNavItem(pathname: NavLocation['pathname']): NavItem | null {
  const feature = getFeaturePayload(config.features.apiDocs);

  if (!feature) {
    return null;
  }

  if (feature.mode === 'external') {
    return {
      text: 'API',
      url: feature.url,
      icon: 'navigation/api_docs',
    };
  }

  return {
    text: 'API',
    nextRoute: { pathname: '/api-docs' as const },
    icon: 'navigation/api_docs',
    isActive: pathname.startsWith('/api-docs'),
  };
}
