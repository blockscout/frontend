import { Box, Flex, Skeleton } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { TokenHolder, TokenInfo } from 'types/api/token';

import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import Utilization from 'ui/shared/Utilization/Utilization';

interface Props {
  holder: TokenHolder;
  token: TokenInfo;
  isLoading?: boolean;
}

const TokenHoldersListItem = ({ holder, token, isLoading }: Props) => {
  const quantity = BigNumber(holder.value).div(BigNumber(10 ** Number(token.decimals))).dp(6).toFormat();

  return (
    <ListItemMobile rowGap={ 3 }>
      <AddressEntity
        address={ holder.address }
        isLoading={ isLoading }
        fontWeight="700"
        maxW="100%"
      />
      <Flex justifyContent="space-between" alignItems="center" width="100%">
        <Skeleton isLoaded={ !isLoading } display="inline-block" width="100%">
          <Box as="span" wordBreak="break-word" mr={ 6 }>
            { quantity }
          </Box>
          { token.total_supply && (
            <Utilization
              value={ BigNumber(holder.value).div(BigNumber(token.total_supply)).dp(4).toNumber() }
              colorScheme="green"
              isLoading={ isLoading }
              display="inline-flex"
              float="right"
            />
          ) }
        </Skeleton>
      </Flex>
    </ListItemMobile>
  );
};

export default TokenHoldersListItem;
