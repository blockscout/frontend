// SPDX-License-Identifier: LicenseRef-Blockscout

import type { PagePrimerConfig, PrimedResource } from '../types';

const heightOrHashFromRoute = { routeParam: 'height_or_hash' };

const getResources = (): Array<PrimedResource> => [
  { resource: 'core:block', pathParams: { height_or_hash: heightOrHashFromRoute }, tabs: [ 'index' ] },
];

export const blockPage: PagePrimerConfig = {
  defaultTab: 'index',
  resources: getResources,
};
