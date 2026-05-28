// SPDX-License-Identifier: LicenseRef-Blockscout

import config from 'client/config';
import getFilterValuesFromQuery from 'client/shared/router/get-filter-values-from-query';

const bridgedTokensChainIds = (() => {
  const feature = config.features.bridgedTokens;
  if (!feature.isEnabled) {
    return [];
  }

  return feature.chains.map(chain => chain.id);
})();

export const getBridgedChainsFilterValue = (getFilterValuesFromQuery<string>).bind(null, bridgedTokensChainIds);
