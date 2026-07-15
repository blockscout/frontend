// SPDX-License-Identifier: LicenseRef-Blockscout

import type { PagePrimerConfig, PrimedResource } from '../types';

import config from 'src/config';

const txInterpretation = config.features.txInterpretation;

const hashFromRoute = { routeParam: 'hash' };

// Mirrors the first-render API requests of the transaction page's default ("Details") tab
// (src/slices/tx/pages/details/Transaction.tsx + TxSubHeading.tsx). Requests are primed only
// when the page opens on the default tab; other tabs are not primed.
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
