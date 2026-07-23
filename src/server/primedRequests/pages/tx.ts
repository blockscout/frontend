// SPDX-License-Identifier: LicenseRef-Blockscout

import type { PagePrimerConfig, PrimedResource } from '../types';

import config from 'src/config';

const txInterpretation = config.features.txInterpretation;

const hashFromRoute = { routeParam: 'hash' };

const getResources = (): Array<PrimedResource> => {
  const interpretation: Array<PrimedResource> = (() => {
    if (!txInterpretation.isEnabled) {
      return [];
    }

    return txInterpretation.provider === 'noves' ?
      [ { resource: 'core:noves_transaction', pathParams: { hash: hashFromRoute }, tabs: [ 'index' ] } ] :
      [ { resource: 'core:tx_interpretation', pathParams: { hash: hashFromRoute }, tabs: [ 'index' ] } ];
  })();

  return [
    { resource: 'core:tx', pathParams: { hash: hashFromRoute }, tabs: [ 'index' ] },
    ...interpretation,
  ];
};

export const txPage: PagePrimerConfig = {
  defaultTab: 'index',
  resources: getResources,
};
