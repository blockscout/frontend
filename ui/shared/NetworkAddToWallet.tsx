import React from 'react';

import config from 'configs/app';
import useAddChainClick from 'lib/web3/useAddChainClick';
import useProvider from 'lib/web3/useProvider';
import { WALLETS_INFO } from 'lib/web3/wallets';
import { Button } from 'toolkit/chakra/button';
import IconSvg from 'ui/shared/IconSvg';

const feature = config.features.web3Wallet;

const NetworkAddToWallet = () => {
  const { provider, wallet } = useProvider();
  const handleClick = useAddChainClick();

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
