import { Tr, Td } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { TokenHolder, TokenInfo } from 'types/api/tokenInfo';

import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import Utilization from 'ui/shared/Utilization/Utilization';

type Props = {
  holder: TokenHolder;
  token: TokenInfo;
}

const TokenTransferTableItem = ({ holder, token }: Props) => {
  const quantity = BigNumber(holder.value).div(BigNumber(10 ** Number(token.decimals))).toFormat();

  return (
    <Tr>
      <Td>
        <Address display="inline-flex" maxW="100%" lineHeight="30px">
          <AddressIcon address={ holder.address }/>
          <AddressLink ml={ 2 } fontWeight="700" hash={ holder.address.hash } alias={ holder.address.name } flexGrow={ 1 }/>
        </Address>
      </Td>
      <Td isNumeric>
        { quantity }
      </Td>
      { token.total_supply && (
        <Td isNumeric>
          <Utilization
            value={ BigNumber(holder.value).div(BigNumber(token.total_supply)).dp(4).toNumber() }
            colorScheme="green"
            display="inline-flex"
          />
        </Td>
      ) }
    </Tr>
  );
};

export default React.memo(TokenTransferTableItem);
