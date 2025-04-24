import React from 'react';

import config from 'configs/app';
import * as mixpanel from 'lib/mixpanel/index';
import useAddChain from 'lib/web3/useAddChain';
import useProvider from 'lib/web3/useProvider';
import useSwitchChain from 'lib/web3/useSwitchChain';
import { WALLETS_INFO } from 'lib/web3/wallets';
import { Button } from 'toolkit/chakra/button';
import { toaster } from 'toolkit/chakra/toaster';
import IconSvg from 'ui/shared/IconSvg';

const feature = config.features.web3Wallet;

const NetworkAddToWallet = () => {
  const { provider, wallet } = useProvider();
  const addChain = useAddChain();
  const switchChain = useSwitchChain();

  const handleClick = React.useCallback(async() => {
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

  if (!provider || !wallet || !config.chain.rpcUrls.length || !feature.isEnabled) {
    return null;
  }

  return (
    <Button variant="outline" size="sm" onClick={ handleClick }>
      <IconSvg name={ WALLETS_INFO[wallet].icon } boxSize={ 5 }/>
      Add { config.chain.name }
    </Button>
  );
};

export default React.memo(NetworkAddToWallet);
