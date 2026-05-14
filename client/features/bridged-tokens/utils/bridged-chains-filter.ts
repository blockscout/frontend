// SPDX-License-Identifier: LicenseRef-Blockscout

import getFilterValuesFromQuery from 'client/shared/router/get-filter-values-from-query';

import config from 'configs/app';

const bridgedTokensChainIds = (() => {
  const feature = config.features.bridgedTokens;
  if (!feature.isEnabled) {
    return [];
  }

  return feature.chains.map(chain => chain.id);
})();

export const getBridgedChainsFilterValue = (getFilterValuesFromQuery<string>).bind(null, bridgedTokensChainIds);
