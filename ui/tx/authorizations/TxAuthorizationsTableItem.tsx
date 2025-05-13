import React from 'react';

import type { TxAuthorization } from 'types/api/transaction';

import config from 'configs/app';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableRow, TableCell } from 'toolkit/chakra/table';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';

interface Props extends TxAuthorization {
  isLoading?: boolean;
}

const TxAuthorizationsItem = ({ address_hash: addressHash, authority, chain_id: chainId, nonce, isLoading }: Props) => {
  return (
    <TableRow alignItems="top">
      <TableCell>
        <AddressEntity address={{ hash: addressHash }} isLoading={ isLoading } noIcon/>
      </TableCell>
      <TableCell verticalAlign="middle">
        <AddressEntity address={{ hash: authority }} isLoading={ isLoading } noIcon/>
      </TableCell>
      <TableCell verticalAlign="middle">
        <Skeleton loading={ isLoading } display="inline-block">
          { chainId === Number(config.chain.id) ? 'this' : 'any' }
        </Skeleton>
      </TableCell>
      <TableCell isNumeric verticalAlign="middle">
        <Skeleton loading={ isLoading } display="inline-block">
          { nonce }
        </Skeleton>
      </TableCell>
    </TableRow>
  );
};

export default React.memo(TxAuthorizationsItem);
