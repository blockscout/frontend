import { Flex } from '@chakra-ui/react';
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
}

const TokenHoldersListItem = ({ holder, token }: Props) => {
  const quantity = BigNumber(holder.value).div(BigNumber(10 ** Number(token.decimals))).dp(6).toFormat();

  return (
    <ListItemMobile rowGap={ 3 }>
      <Address display="inline-flex" maxW="100%" lineHeight="30px">
        <AddressIcon address={ holder.address }/>
        <AddressLink type="address" ml={ 2 } fontWeight="700" hash={ holder.address.hash } alias={ holder.address.name } flexGrow={ 1 }/>
      </Address>
      <Flex justifyContent="space-between" alignItems="center" width="100%">
        { quantity }
        { token.total_supply && (
          <Utilization
            value={ BigNumber(holder.value).div(BigNumber(token.total_supply)).dp(4).toNumber() }
            colorScheme="green"
            ml={ 6 }
          />
        ) }
      </Flex>
    </ListItemMobile>
  );
};

export default TokenHoldersListItem;
