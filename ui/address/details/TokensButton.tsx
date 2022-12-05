import { Button, Icon, Text } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { AddressTokenBalance } from 'types/api/address';

import arrowIcon from 'icons/arrows/east-mini.svg';
import tokensIcon from 'icons/tokens.svg';
import { ZERO } from 'lib/consts';

interface Props {
  isOpen: boolean;
  onClick: () => void;
  data: Array<AddressTokenBalance>;
}

const TokensButton = ({ isOpen, onClick, data }: Props, ref: React.ForwardedRef<HTMLButtonElement>) => {
  const usdBn = data.reduce((result, item) => {
    if (!item.token.exchange_rate) {
      return result;
    }
    const decimals = Number(item.token.decimals || '18');
    return BigNumber(item.value).div(BigNumber(10 ** decimals)).multipliedBy(BigNumber(item.token.exchange_rate));
  }, ZERO);

  return (
    <Button
      ref={ ref }
      size="sm"
      variant="outline"
      colorScheme="gray"
      onClick={ onClick }
    >
      <Icon as={ tokensIcon } boxSize={ 4 } mr={ 2 }/>
      <Text fontWeight={ 600 }>{ data.length }</Text>
      <Text whiteSpace="pre" variant="secondary" fontWeight={ 400 }> (${ usdBn.toFixed(2) })</Text>
      <Icon as={ arrowIcon } transform={ isOpen ? 'rotate(90deg)' : 'rotate(-90deg)' } transitionDuration="normal" boxSize={ 5 } ml={ 3 }/>
    </Button>
  );
};

export default React.forwardRef(TokensButton);
