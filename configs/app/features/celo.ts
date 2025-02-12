import type { Feature } from './types';

import { getEnvValue } from '../utils';

const title = 'Celo chain';

const config: Feature<{ L2UpgradeBlock: number | undefined; BLOCKS_PER_EPOCH: number }> = (() => {

  if (getEnvValue('NEXT_PUBLIC_CELO_ENABLED') === 'true') {
    return Object.freeze({
      title,
      isEnabled: true,
      L2UpgradeBlock: getEnvValue('NEXT_PUBLIC_CELO_L2_UPGRADE_BLOCK') ? Number(getEnvValue('NEXT_PUBLIC_CELO_L2_UPGRADE_BLOCK')) : undefined,
      BLOCKS_PER_EPOCH: 17_280,
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
