// SPDX-License-Identifier: LicenseRef-Blockscout

import type { AdditionalTokenType, NftMarketplaceItem } from 'src/slices/token/types/client';

import { getEnvValue, parseEnvJson } from 'src/config/utils/envs';

const nftMarketplaces = (() => {
  const marketplaces = parseEnvJson<Array<NftMarketplaceItem>>(getEnvValue('NEXT_PUBLIC_VIEWS_NFT_MARKETPLACES')) || [];
  const isValid = marketplaces.every(marketplace => marketplace.collection_url || marketplace.instance_url);

  if (!isValid) {
    return [];
  }

  return marketplaces;
})();

const config = Object.freeze({
  standard: getEnvValue('NEXT_PUBLIC_NETWORK_TOKEN_STANDARD_NAME') || 'ERC',
  additionalTypes: parseEnvJson<Array<AdditionalTokenType>>(getEnvValue('NEXT_PUBLIC_NETWORK_ADDITIONAL_TOKEN_TYPES')) || [],
  hideScamTokensEnabled: getEnvValue('NEXT_PUBLIC_VIEWS_TOKEN_SCAM_TOGGLE_ENABLED') === 'true',
  nft: {
    marketplaces: nftMarketplaces,
    verifiedFetch: {
      isEnabled: getEnvValue('NEXT_PUBLIC_HELIA_VERIFIED_FETCH_ENABLED') === 'false' ? false : true,
    },
  },
});

export default config;
