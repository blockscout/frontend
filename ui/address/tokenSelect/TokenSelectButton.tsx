import { Button, Icon, Text } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import arrowIcon from 'icons/arrows/east-mini.svg';
import tokensIcon from 'icons/tokens.svg';
import { ZERO } from 'lib/consts';

import type { EnhancedData } from './utils';

interface Props {
  isOpen: boolean;
  onClick: () => void;
  data: Array<EnhancedData>;
}

const TokenSelectButton = ({ isOpen, onClick, data }: Props, ref: React.ForwardedRef<HTMLButtonElement>) => {
  const totalBn = data.reduce((result, item) => !item.usd ? result : result.plus(BigNumber(item.usd)), ZERO);

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
      <Text whiteSpace="pre" variant="secondary" fontWeight={ 400 }> (${ totalBn.toFormat(2) })</Text>
      <Icon as={ arrowIcon } transform={ isOpen ? 'rotate(90deg)' : 'rotate(-90deg)' } transitionDuration="faster" boxSize={ 5 } ml={ 3 }/>
    </Button>
  );
};

export default React.forwardRef(TokenSelectButton);
