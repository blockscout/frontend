import type { MarketplaceTitles } from 'types/views/marketplace';

import { getEnvValue, parseEnvJson } from 'configs/app/utils';

const config = Object.freeze({
  titles: parseEnvJson<MarketplaceTitles>(getEnvValue('NEXT_PUBLIC_VIEWS_MARKETPLACE_TITLES')) || {},
});

export default config;
