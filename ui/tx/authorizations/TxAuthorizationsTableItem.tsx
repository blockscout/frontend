import { Tr, Td } from '@chakra-ui/react';
import React from 'react';

import type { TxAuthorization } from 'types/api/transaction';

import config from 'configs/app';
import Skeleton from 'ui/shared/chakra/Skeleton';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';

interface Props extends TxAuthorization {
  isLoading?: boolean;
}

const TxAuthorizationsItem = ({ address, authority, chain_id: chainId, nonce, isLoading }: Props) => {
  return (
    <Tr alignItems="top">
      <Td>
        <AddressEntity address={{ hash: address }} isLoading={ isLoading } noIcon/>
      </Td>
      <Td verticalAlign="middle">
        <AddressEntity address={{ hash: authority }} isLoading={ isLoading } noIcon/>
      </Td>
      <Td verticalAlign="middle">
        <Skeleton isLoaded={ !isLoading } display="inline-block">
          { chainId === Number(config.chain.id) ? 'this' : 'any' }
        </Skeleton>
      </Td>
      <Td isNumeric verticalAlign="middle">
        <Skeleton isLoaded={ !isLoading } display="inline-block">
          { nonce }
        </Skeleton>
      </Td>
    </Tr>
  );
};

export default React.memo(TxAuthorizationsItem);
