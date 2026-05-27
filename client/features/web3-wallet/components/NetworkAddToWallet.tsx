// SPDX-License-Identifier: LicenseRef-Blockscout

import config from 'client/config';
import React from 'react';

import { WALLETS_INFO } from '../types/wallets';

import SpriteIcon from 'client/sprite/SpriteIcon';

import { Button } from 'toolkit/chakra/button';

import useAddChainClick from '../hooks/useAddChainClick';
import useProvider from '../hooks/useProvider';

interface Props {
  source: 'Footer' | 'Top bar';
  onAddSuccess?: () => void;
}

const NetworkAddToWallet = ({ source, onAddSuccess }: Props) => {
  const { data: { wallet } = {} } = useProvider();

  const handleClick = useAddChainClick({ source, onSuccess: onAddSuccess });

  if (!wallet) {
    return null;
  }

  const walletInfo = WALLETS_INFO[wallet];

  return (
    <Button
      variant="outline"
      size="2xs"
      borderWidth="1px"
      fontWeight="500"
      color={ walletInfo.color }
      borderColor={ walletInfo.color }
      onClick={ handleClick }
      _hover={{
        color: 'link.primary.hover',
        borderColor: 'link.primary.hover',
      }}
    >
      <SpriteIcon name={ walletInfo.icon } boxSize={ 3 }/>
      Add { config.chain.name }
    </Button>
  );
};

export default React.memo(NetworkAddToWallet);
