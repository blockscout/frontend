import type { Feature } from './types';

import apis from '../apis';
import { getEnvValue } from '../utils';

const isEnabled = getEnvValue('NEXT_PUBLIC_MULTICHAIN_ENABLED') === 'true';
const cluster = getEnvValue('NEXT_PUBLIC_MULTICHAIN_CLUSTER');

// The feature was initially implemented for OP Superchain interop cluster
// but later the project was abandoned by Optimism team.
// Now it serves mainly for demo purposes of multichain explorer possible functionalities.
// So for now I have kept all naming in the code as it was initially done
// and later it could be changed when specific multichain cluster will be implemented.
const title = 'OP Superchain interop explorer';

const config: Feature<{ cluster: string }> = (() => {
  if (apis.multichainAggregator && apis.multichainStats && isEnabled && cluster) {
    return Object.freeze({
      title,
      isEnabled: true,
      cluster,
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
