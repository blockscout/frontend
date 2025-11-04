import React from 'react';

import config from 'configs/app';
import useAddChainClick from 'lib/web3/useAddChainClick';
import useProvider from 'lib/web3/useProvider';
import { WALLETS_INFO } from 'lib/web3/wallets';
import { Button } from 'toolkit/chakra/button';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  source: 'Footer' | 'Top bar';
}

const NetworkAddToWallet = ({ source }: Props) => {
  const { provider, wallet } = useProvider();
  const handleClick = useAddChainClick({ source });

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
      _hover={{
        color: 'link.primary.hover',
        borderColor: 'link.primary.hover',
      }}
    >
      <IconSvg name={ WALLETS_INFO[wallet].icon } boxSize={ 3 }/>
      Add { config.chain.name }
    </Button>
  );
};

export default React.memo(NetworkAddToWallet);
