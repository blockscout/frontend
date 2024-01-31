import { Box, Button, Skeleton, Text, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import type { FormattedData } from './types';

import * as mixpanel from 'lib/mixpanel/index';
import IconSvg from 'ui/shared/IconSvg';

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
        <IconSvg name="tokens" boxSize={ 4 } mr={ 2 }/>
        <Text fontWeight={ 600 }>{ prefix }{ num }</Text>
        <Text whiteSpace="pre" variant="secondary" fontWeight={ 400 }> ({ prefix }${ usd.toFormat(2) })</Text>
        <IconSvg name="arrows/east-mini" transform={ isOpen ? 'rotate(90deg)' : 'rotate(-90deg)' } transitionDuration="faster" boxSize={ 5 } ml={ 3 }/>
      </Button>
      { isLoading && !isOpen && <Skeleton h="100%" w="100%" position="absolute" top={ 0 } left={ 0 } bgColor={ skeletonBgColor } borderRadius="base"/> }
    </Box>
  );
};

export default React.forwardRef(TokenSelectButton);
