// SPDX-License-Identifier: LicenseRef-Blockscout

import type { PagePrimerConfig, PrimedResource } from '../types';

import config from 'src/config';

const txInterpretation = config.features.txInterpretation;

const hashFromRoute = { routeParam: 'hash' };

const getResources = (): Array<PrimedResource> => [
  { resource: 'core:user_op', pathParams: { hash: hashFromRoute }, tabs: [ 'index' ] },
  ...(txInterpretation.isEnabled ?
    [ { resource: 'core:user_op_interpretation', pathParams: { hash: hashFromRoute }, tabs: [ 'index' ] } satisfies PrimedResource ] :
    []),
];

export const userOpPage: PagePrimerConfig = {
  defaultTab: 'index',
  resources: getResources,
};
