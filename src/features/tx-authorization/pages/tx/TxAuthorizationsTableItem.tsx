// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';

import TxAuthorizationStatus from 'src/features/tx-authorization/components/TxAuthorizationStatus';

import config from 'src/config';

import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { TableRow, TableCell } from 'src/toolkit/chakra/table';

interface Props {
  data: schemas['SignedAuthorization'];
  isLoading?: boolean;
}

const TxAuthorizationsItem = ({ data, isLoading }: Props) => {
  return (
    <TableRow alignItems="top">
      <TableCell>
        <Flex>
          <AddressEntity address={{ hash: data.authority }} isLoading={ isLoading } noIcon/>
        </Flex>
      </TableCell>
      <TableCell verticalAlign="middle">
        <Flex>
          <AddressEntity address={{ hash: data.address_hash }} isLoading={ isLoading } noIcon/>
        </Flex>
      </TableCell>
      <TableCell verticalAlign="middle">
        <Skeleton loading={ isLoading } display="inline-block">
          { data.chain_id === Number(config.chain.id) ? 'this' : 'any' }
        </Skeleton>
      </TableCell>
      <TableCell verticalAlign="middle">
        <Skeleton loading={ isLoading } display="inline-block">
          { data.nonce }
        </Skeleton>
      </TableCell>
      <TableCell verticalAlign="middle">
        <TxAuthorizationStatus status={ data.status } loading={ isLoading }/>
      </TableCell>
    </TableRow>
  );
};

export default React.memo(TxAuthorizationsItem);
