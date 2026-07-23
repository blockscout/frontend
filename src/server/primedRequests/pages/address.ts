// SPDX-License-Identifier: LicenseRef-Blockscout

import type { PagePrimerConfig, PrimedResource } from '../types';

import config from 'src/config';

const hashFromRoute = { routeParam: 'hash' };

const getResources = (): Array<PrimedResource> => {
  if (config.features.multichain.isEnabled) {
    // the multichain address page renders a different component with its own resources
    return [];
  }

  return [
    { resource: 'core:address', pathParams: { hash: hashFromRoute }, tabs: [ 'index' ] },
    { resource: 'core:address_tabs_counters', pathParams: { hash: hashFromRoute }, tabs: [ 'index' ] },
    // { resource: 'core:address_counters', pathParams: { hash: hashFromRoute }, tabs: [ 'index' ] },
    ...(config.features.userOps.isEnabled ?
      [ { resource: 'core:user_ops_account', pathParams: { hash: hashFromRoute }, tabs: [ 'index' ] } satisfies PrimedResource ] :
      []),
    ...(config.features.xStarScore.isEnabled ?
      [ { resource: 'core:address_xstar_score', pathParams: { hash: hashFromRoute }, tabs: [ 'index' ] } satisfies PrimedResource ] :
      []),
  ];
};

export const addressPage: PagePrimerConfig = {
  defaultTab: 'index',
  resources: getResources,
};
