import React from 'react';

import * as mixpanel from 'lib/mixpanel/index';
import { toaster } from 'toolkit/chakra/toaster';

import useAddChain from './useAddChain';
import useProvider from './useProvider';
import useSwitchChain from './useSwitchChain';

export default function useAddChainClick() {
  const { provider, wallet } = useProvider();
  const addChain = useAddChain();
  const switchChain = useSwitchChain();

  return React.useCallback(async() => {
    if (!wallet || !provider) {
      return;
    }

    try {
      await addChain();
      await switchChain();

      toaster.success({
        title: 'Success',
        description: 'Successfully added network to your wallet',
      });

      mixpanel.logEvent(mixpanel.EventTypes.ADD_TO_WALLET, {
        Target: 'network',
        Wallet: wallet,
      });

    } catch (error) {
      toaster.error({
        title: 'Error',
        description: (error as Error)?.message || 'Something went wrong',
      });
    }
  }, [ addChain, provider, wallet, switchChain ]);
}
