import { Box, Hide, Popover, PopoverArrow, PopoverContent, PopoverTrigger, Show, Text, useColorModeValue } from '@chakra-ui/react';
import type { FC } from 'react';
import React from 'react';

import lightning from 'icons/lightning.svg';
import { roundNumberIfNeeded } from 'lib/utils/numberHelpers';
import { camelCaseToSentence } from 'lib/utils/stringHelpers';
import Icon from 'ui/shared/chakra/Icon';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';

import TokensCard from './TokensCard';
import type { Action, FlowViewItem } from './utils/generateFlowViewData';

interface Props {
  item: FlowViewItem;
}

const ActionCard: FC<Props> = ({ item }) => {
  const popoverBg = useColorModeValue('gray.700', 'gray.300');

  const getTokenData = (action: Action) => {
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
            { camelCaseToSentence(item.action.label) }
          </Text>
          <Text fontWeight="500">
            { roundNumberIfNeeded(item.action.amount?.toString() || '', 3) }
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
                color="#718096"
                _dark={{ color: '#92a2bb' }}
              />
              <Text fontWeight="700" >
                { camelCaseToSentence(item.action.label) }
              </Text>
              <Text fontWeight="500">
                { roundNumberIfNeeded(item.action.amount?.toString() || '', 3) }
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

              <TokensCard
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

export default React.memo(ActionCard);
