import { Box, Hide, PopoverArrow, PopoverContent, PopoverTrigger, Show, Skeleton, Text, useColorModeValue } from '@chakra-ui/react';
import type { FC } from 'react';
import React from 'react';

import { HEX_REGEXP } from 'lib/regexp';
import Popover from 'ui/shared/chakra/Popover';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';
import IconSvg from 'ui/shared/IconSvg';

import type { NovesFlowViewItem } from '../utils/generateFlowViewData';
import NovesTokenTooltipContent from './NovesTokenTooltipContent';

interface Props {
  item: NovesFlowViewItem;
  isLoaded: boolean;
}

const NovesActionSnippet: FC<Props> = ({ item, isLoaded }) => {
  const popoverBg = useColorModeValue('gray.700', 'gray.300');

  const token = React.useMemo(() => {
    const action = item.action;

    const name = action.nft?.name || action.token?.name;
    const symbol = action.nft?.symbol || action.token?.symbol;

    const token = {
      name: name || '',
      symbol: (symbol?.toLowerCase() === name?.toLowerCase() ? undefined : symbol) || '',
      address: action.nft?.address || action.token?.address || '',
      icon_url: '',
      type: action.nft ? 'ERC-721' as const : 'ERC-20' as const,
    };

    return token;
  }, [ item.action ]);

  const validTokenAddress = token.address ? HEX_REGEXP.test(token.address) : false;

  return (
    <Skeleton borderRadius="sm" isLoaded={ isLoaded }>
      <Hide above="lg">
        <Box display="flex" gap={ 2 } cursor="pointer" flexWrap="wrap">
          <Text fontWeight="700" >
            { item.action.label }
          </Text>
          <Text fontWeight="500">
            { item.action.amount }
          </Text>
          <TokenEntity
            token={ token }
            noCopy
            noSymbol
            noLink={ !validTokenAddress }
            fontWeight="500"
            color="link"
            w="fit-content"
          />
        </Box>
      </Hide>
      <Show above="lg">

        <Popover
          trigger="hover"
          openDelay={ 50 }
          closeDelay={ 50 }
          arrowSize={ 15 }
          arrowShadowColor="transparent"
          placement="bottom"
          flip={ false }
        >
          <PopoverTrigger>
            <Box display="flex" gap={ 2 } cursor="pointer" w="fit-content" maxW="100%" alignItems="center">
              <IconSvg
                name="lightning"
                height="5"
                width="5"
                color="gray.500"
                _dark={{ color: 'gray.400' }}
              />
              <Text fontWeight="700" >
                { item.action.label }
              </Text>
              <Text fontWeight="500">
                { item.action.amount }
              </Text>
              <TokenEntity
                token={ token }
                noCopy
                jointSymbol
                noLink={ !validTokenAddress }
                fontWeight="500"
                color="link"
                w="fit-content"
              />
            </Box>

          </PopoverTrigger>
          <PopoverContent
            bg={ popoverBg }
            shadow="lg"
            width="fit-content"
            zIndex="modal"
            padding={ 2 }
          >
            <PopoverArrow bg={ popoverBg }/>

            <NovesTokenTooltipContent
              token={ item.action.token || item.action.nft }
              amount={ item.action.amount }
            />
          </PopoverContent>
        </Popover>
      </Show>
    </Skeleton>
  );
};

export default React.memo(NovesActionSnippet);
