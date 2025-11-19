import appConfig from 'configs/app';
import * as essentialDappsChainsConfig from 'configs/essential-dapps-chains/config.edge';
import * as multichainConfig from 'configs/multichain/config.edge';

import generateCspPolicy from './generateCspPolicy';

const marketplaceFeature = appConfig.features.marketplace;

let cspPolicy: string | undefined = undefined;

export async function get() {
  if (!cspPolicy) {
    appConfig.features.opSuperchain.isEnabled && await multichainConfig.load();
    marketplaceFeature.isEnabled && marketplaceFeature.essentialDapps && await essentialDappsChainsConfig.load();
    cspPolicy = generateCspPolicy();
  }

  return cspPolicy;
}
