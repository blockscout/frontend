import { Box, Text } from '@chakra-ui/react';
import type { FC } from 'react';
import React from 'react';

import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tooltip } from 'toolkit/chakra/tooltip';
import { HEX_REGEXP } from 'toolkit/utils/regexp';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';
import IconSvg from 'ui/shared/IconSvg';

import type { NovesFlowViewItem } from '../utils/generateFlowViewData';
import NovesTokenTooltipContent from './NovesTokenTooltipContent';

interface Props {
  item: NovesFlowViewItem;
  isLoaded: boolean;
}

const NovesActionSnippet: FC<Props> = ({ item, isLoaded }) => {
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

  const tooltipContent = (
    <NovesTokenTooltipContent
      token={ item.action.token || item.action.nft }
      amount={ item.action.amount }
    />
  );

  return (
    <Skeleton borderRadius="sm" loading={ !isLoaded }>
      <Box hideFrom="lg" display="flex" gap={ 2 } cursor="pointer" flexWrap="wrap">
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
          color="link.primary"
          w="fit-content"
        />
      </Box>

      <Tooltip
        content={ tooltipContent }
        openDelay={ 50 }
        closeDelay={ 50 }
        positioning={{ placement: 'bottom' }}
        interactive
      >
        <Box hideBelow="lg" display="flex" gap={ 2 } cursor="pointer" w="fit-content" maxW="100%" alignItems="center">
          <IconSvg
            name="lightning"
            height="5"
            width="5"
            color={{ _light: 'gray.500', _dark: 'gray.400' }}
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
            color="link.primary"
            w="fit-content"
          />
        </Box>
      </Tooltip>
    </Skeleton>
  );
};

export default React.memo(NovesActionSnippet);
