import type { NftMarketplaceItem } from 'types/views/nft';

import { getEnvValue, parseEnvJson } from 'configs/app/utils';

const config = Object.freeze({
  marketplaces: parseEnvJson<Array<NftMarketplaceItem>>(getEnvValue('NEXT_PUBLIC_VIEWS_NFT_MARKETPLACES')) || [],
  verifiedFetch: {
    isEnabled: getEnvValue('NEXT_PUBLIC_HELIA_VERIFIED_FETCH_ENABLED') === 'false' ? false : true,
  },
});

export default config;
