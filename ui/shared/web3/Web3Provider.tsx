import config from 'configs/app';

import DynamicProvider from './providers/DynamicProvider';
import ReownProvider from './providers/ReownProvider';
import WagmiProvider from './providers/WagmiProvider';

const feature = config.features.blockchainInteraction;

const Web3Provider = (() => {
  if (feature.isEnabled && feature.connectorType === 'reown') {
    return ReownProvider;
  }

  if (feature.isEnabled && feature.connectorType === 'dynamic') {
    return DynamicProvider;
  }

  return WagmiProvider;
})();

export default Web3Provider;
