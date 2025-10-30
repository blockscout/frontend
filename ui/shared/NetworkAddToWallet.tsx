import React from 'react';

import useAddChainClick from 'lib/web3/useAddChainClick';
import useProvider from 'lib/web3/useProvider';
import { WALLETS_INFO } from 'lib/web3/wallets';
import { Button } from 'toolkit/chakra/button';
import IconSvg from 'ui/shared/IconSvg';

const NetworkAddToWallet = () => {
  const { provider, wallet } = useProvider();
  const handleClick = useAddChainClick();

  if (!provider || !wallet) {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="2xs"
      borderWidth="1px"
      fontWeight="500"
      color={ WALLETS_INFO[wallet].color }
      borderColor={ WALLETS_INFO[wallet].color }
      onClick={ handleClick }
    >
      <IconSvg name={ WALLETS_INFO[wallet].icon } boxSize={ 4 }/>
      Add chain
    </Button>
  );
};

export default React.memo(NetworkAddToWallet);
