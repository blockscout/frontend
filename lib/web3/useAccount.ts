import { useAccount as useAccountWagmi } from 'wagmi';

import config from 'configs/app';

import useAccountDynamic from './account/useAccountDynamic';
import useAccountFallback from './account/useAccountFallback';

const feature = config.features.blockchainInteraction;

const useAccount = (() => {
  if (feature.isEnabled && feature.connectorType === 'reown') {
    return useAccountWagmi;
  }

  if (feature.isEnabled && feature.connectorType === 'dynamic') {
    return useAccountDynamic;
  }

  return useAccountFallback;
})();

export default useAccount;
