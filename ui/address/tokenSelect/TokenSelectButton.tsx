import { Box, Button, Skeleton, chakra, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import type { FormattedData } from './types';

import { space } from 'lib/html-entities';
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
        isActive={ isOpen }
        aria-label="Token select"
      >
        <IconSvg name="tokens" boxSize={ 4 } mr={ 2 }/>
        <chakra.span fontWeight={ 600 }>{ prefix }{ num }</chakra.span>
        <chakra.span
          whiteSpace="pre"
          color="text_secondary"
          fontWeight={ 400 }
          maxW={{ base: 'calc(100vw - 230px)', lg: '500px' }}
          overflow="hidden"
          textOverflow="ellipsis"
        >
          { space }({ prefix }${ usd.toFormat(2) })
        </chakra.span>
        <IconSvg name="arrows/east-mini" transform={ isOpen ? 'rotate(90deg)' : 'rotate(-90deg)' } transitionDuration="faster" boxSize={ 5 } ml={ 3 }/>
      </Button>
      { isLoading && !isOpen && <Skeleton h="100%" w="100%" position="absolute" top={ 0 } left={ 0 } bgColor={ skeletonBgColor } borderRadius="base"/> }
    </Box>
  );
};

export default React.forwardRef(TokenSelectButton);
