// SPDX-License-Identifier: LicenseRef-Blockscout

import config from 'src/config';
import getFilterValuesFromQuery from 'src/shared/router/get-filter-values-from-query';

const bridgedTokensChainIds = (() => {
  const feature = config.features.bridgedTokens;
  if (!feature.isEnabled) {
    return [];
  }

  return feature.chains.map(chain => chain.id);
})();

export const getBridgedChainsFilterValue = (getFilterValuesFromQuery<string>).bind(null, bridgedTokensChainIds);
