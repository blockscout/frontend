import { Tr, Td, Skeleton } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { TokenHolder, TokenInfo } from 'types/api/token';

import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import Utilization from 'ui/shared/Utilization/Utilization';

type Props = {
  holder: TokenHolder;
  token: TokenInfo;
  isLoading?: boolean;
}

const TokenTransferTableItem = ({ holder, token, isLoading }: Props) => {
  const quantity = BigNumber(holder.value).div(BigNumber(10 ** Number(token.decimals))).toFormat();

  return (
    <Tr>
      <Td verticalAlign="middle">
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
            truncation="constant"
          />
          <CopyToClipboard text={ holder.address.hash } isLoading={ isLoading }/>
        </Address>
      </Td>
      <Td verticalAlign="middle" isNumeric>
        <Skeleton isLoaded={ !isLoading } display="inline-block" wordBreak="break-word">
          { quantity }
        </Skeleton>
      </Td>
      { token.total_supply && (
        <Td verticalAlign="middle" isNumeric>
          <Utilization
            value={ BigNumber(holder.value).div(BigNumber(token.total_supply)).dp(4).toNumber() }
            colorScheme="green"
            display="inline-flex"
            isLoading={ isLoading }
          />
        </Td>
      ) }
    </Tr>
  );
};

export default React.memo(TokenTransferTableItem);
