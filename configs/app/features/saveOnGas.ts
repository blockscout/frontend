import type { Feature } from './types';

import { getEnvValue } from '../utils';
import marketplace from './marketplace';

const title = 'Save on gas with GasHawk';

const config: Feature<{
  apiUrlTemplate: string;
}> = (() => {
  if (getEnvValue('NEXT_PUBLIC_SAVE_ON_GAS_ENABLED') === 'true' && marketplace.isEnabled) {
    return Object.freeze({
      title,
      isEnabled: true,
      apiUrlTemplate: 'https://core.gashawk.io/apiv2/stats/address/<address>/savingsPotential/0x1',
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
