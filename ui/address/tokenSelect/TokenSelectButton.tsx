import { Box, Button, Icon, Skeleton, Text, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import type { FormattedData } from './types';

import arrowIcon from 'icons/arrows/east-mini.svg';
import tokensIcon from 'icons/tokens.svg';
import * as mixpanel from 'lib/mixpanel/index';

import { getTokensTotalInfo } from '../utils/tokenUtils';

interface Props {
  isOpen: boolean;
  isLoading: boolean;
  onClick: () => void;
  data: FormattedData;
}

const TokenSelectButton = ({ isOpen, isLoading, onClick, data }: Props, ref: React.ForwardedRef<HTMLButtonElement>) => {
  const { usd, num, isOverflow } = getTokensTotalInfo(data);
  const skeletonBgColor = useColorModeValue('white', 'black');

  const prefix = isOverflow ? '>' : '';

  const handleClick = React.useCallback(() => {
    if (isLoading && !isOpen) {
      return;
    }

    mixpanel.logEvent(mixpanel.EventTypes.PAGE_WIDGET, { Type: 'Tokens dropdown' });
    onClick();
  }, [ isLoading, isOpen, onClick ]);

  return (
    <Box position="relative">
      <Button
        ref={ ref }
        size="sm"
        variant="outline"
        colorScheme="gray"
        onClick={ handleClick }
        aria-label="Token select"
      >
        <Icon as={ tokensIcon } boxSize={ 4 } mr={ 2 }/>
        <Text fontWeight={ 600 }>{ prefix }{ num }</Text>
        <Text whiteSpace="pre" variant="secondary" fontWeight={ 400 }> ({ prefix }${ usd.toFormat(2) })</Text>
        <Icon as={ arrowIcon } transform={ isOpen ? 'rotate(90deg)' : 'rotate(-90deg)' } transitionDuration="faster" boxSize={ 5 } ml={ 3 }/>
      </Button>
      { isLoading && !isOpen && <Skeleton h="100%" w="100%" position="absolute" top={ 0 } left={ 0 } bgColor={ skeletonBgColor }/> }
    </Box>
  );
};

export default React.forwardRef(TokenSelectButton);
