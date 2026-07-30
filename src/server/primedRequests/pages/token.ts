// SPDX-License-Identifier: LicenseRef-Blockscout

import type { PagePrimerConfig, PrimedResource } from '../types';

const hashFromRoute = { routeParam: 'hash' };

const getResources = (): Array<PrimedResource> => [
  { resource: 'core:token', pathParams: { hash: hashFromRoute }, tabs: [ 'index' ] },
  { resource: 'core:token_counters', pathParams: { hash: hashFromRoute }, tabs: [ 'index' ] },
];

export const tokenPage: PagePrimerConfig = {
  defaultTab: 'index',
  resources: getResources,
};
