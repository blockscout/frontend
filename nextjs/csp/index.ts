import appConfig from 'configs/app';
import * as multichainConfig from 'configs/multichain/config.edge';

import generateCspPolicy from './generateCspPolicy';

let cspPolicy: string | undefined = undefined;

export async function get() {
  if (!cspPolicy) {
    appConfig.features.opSuperchain.isEnabled && await multichainConfig.load();
    cspPolicy = generateCspPolicy();
  }

  return cspPolicy;
}
