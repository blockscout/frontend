import { Flex, Skeleton } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { TokenHolder, TokenInfo } from 'types/api/token';

import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
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
      <Address display="inline-flex" maxW="100%">
        <AddressIcon address={ holder.address } isLoading={ isLoading }/>
        <AddressLink
          type="address"
          ml={ 2 }
          fontWeight="700"
          hash={ holder.address.hash }
          alias={ holder.address.name }
          flexGrow={ 1 }
          isLoading={ isLoading }
        />
      </Address>
      <Flex justifyContent="space-between" alignItems="center" width="100%">
        <Skeleton isLoaded={ !isLoading } display="inline-block">
          { quantity }
        </Skeleton>
        { token.total_supply && (
          <Utilization
            value={ BigNumber(holder.value).div(BigNumber(token.total_supply)).dp(4).toNumber() }
            colorScheme="green"
            ml={ 6 }
            isLoading={ isLoading }
          />
        ) }
      </Flex>
    </ListItemMobile>
  );
};

export default TokenHoldersListItem;
