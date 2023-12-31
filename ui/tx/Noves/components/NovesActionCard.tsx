import { Box, Hide, Popover, PopoverArrow, PopoverContent, PopoverTrigger, Show, Text, useColorModeValue } from '@chakra-ui/react';
import type { FC } from 'react';
import React from 'react';

import lightning from 'icons/lightning.svg';
import Icon from 'ui/shared/chakra/Icon';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';

import type { NovesAction, NovesFlowViewItem } from '../utils/NovesGenerateFlowViewData';
import NovesTokensCard from './NovesTokensCard';

interface Props {
  item: NovesFlowViewItem;
}

const NovesActionCard: FC<Props> = ({ item }) => {
  const popoverBg = useColorModeValue('gray.700', 'gray.300');

  const getTokenData = (action: NovesAction) => {
    const name = action.nft?.name || action.token?.name;
    const symbol = action.nft?.symbol || action.token?.symbol;

    const token = {
      name: name,
      symbol: symbol?.toLowerCase() === name?.toLowerCase() ? undefined : symbol,
      address: action.nft?.address || action.token?.address,
    };

    return token;
  };

  return (
    <>
      <Hide above="md">
        <Box display="flex" gap={ 2 } cursor="pointer" flexWrap="wrap">
          <Text fontWeight="700" >
            { item.action.label }
          </Text>
          <Text fontWeight="500">
            { item.action.amount }
          </Text>
          <TokenEntity
            token={ getTokenData(item.action) }
            noCopy
            noSymbol
            noLink
            fontWeight="500"
            color="link"
            w="fit-content"
          />
        </Box>
      </Hide>
      <Show above="md">

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
            <Box display="flex" gap={ 2 } cursor="pointer" w="fit-content" maxW="100%">
              <Icon
                as={ lightning }
                display="flex"
                fontSize="xl"
                mr="5px"
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
                token={ getTokenData(item.action) }
                noCopy
                jointSymbol
                noLink
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
          >
            <PopoverArrow bg={ popoverBg }/>
            <Box p={ 2 }>

              <NovesTokensCard
                token={ item.action.token || item.action.nft }
                amount={ item.action.amount }
              />

            </Box>
          </PopoverContent>
        </Popover>
      </Show>
    </>
  );
};

export default React.memo(NovesActionCard);
