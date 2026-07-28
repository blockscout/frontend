// SPDX-License-Identifier: LicenseRef-Blockscout

import type { PagePrimerConfig, PrimedResource } from '../types';

const hashFromRoute = { routeParam: 'hash' };
const idFromRoute = { routeParam: 'id' };

const getResources = (): Array<PrimedResource> => [
  { resource: 'core:token', pathParams: { hash: hashFromRoute }, tabs: [ 'index' ] },
  { resource: 'core:token_instance', pathParams: { hash: hashFromRoute, id: idFromRoute }, tabs: [ 'index' ] },
];

export const tokenInstancePage: PagePrimerConfig = {
  defaultTab: 'index',
  resources: getResources,
};
