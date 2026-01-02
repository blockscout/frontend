import config from 'configs/app';

import useWalletDynamic from './wallet/useWalletDynamic';
import useWalletFallback from './wallet/useWalletFallback';
import useWalletReown from './wallet/useWalletReown';

const feature = config.features.blockchainInteraction;

const useWallet = (() => {
  if (feature.isEnabled && feature.connectorType === 'reown') {
    return useWalletReown;
  }

  if (feature.isEnabled && feature.connectorType === 'dynamic') {
    return useWalletDynamic;
  }

  return useWalletFallback;
})();

export default useWallet;
