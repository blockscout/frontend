import type { Feature } from './types';
import type { GasUnit } from 'types/client/gasTracker';

import { getEnvValue } from '../utils';

const isDisabled = getEnvValue('NEXT_PUBLIC_GAS_TRACKER_ENABLED') === 'false';

const primaryUnits = ((): GasUnit => {
  const envValue = getEnvValue('NEXT_PUBLIC_GAS_TRACKER_PREFERRED_UNITS');
  return envValue === 'gwei' ? 'gwei' : 'usd';
})();

const title = 'Gas tracker';

const config: Feature<{ primaryUnits: GasUnit }> = (() => {
  if (!isDisabled) {
    return Object.freeze({
      title,
      isEnabled: true,
      primaryUnits,
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
