// SPDX-License-Identifier: LicenseRef-Blockscout

import BigNumber from 'bignumber.js';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';
import BlockEntity from 'src/slices/block/components/entity/BlockEntity';
import TxEntity from 'src/slices/tx/components/entity/TxEntity';

import { parentChain } from 'src/features/rollup/common/utils/parent-chain-entity';

import config from 'src/config';
import TimeWithTooltip from 'src/shared/date-and-time/TimeWithTooltip';

import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'src/toolkit/chakra/table';

const rollupFeature = config.features.rollup;

type Props = { item: schemas['OptimismDeposit']; isLoading?: boolean };

const OptimisticDepositsTableItem = ({ item, isLoading }: Props) => {

  if (!rollupFeature.isEnabled || rollupFeature.type !== 'optimistic') {
    return null;
  }

  return (
    <TableRow>
      <TableCell verticalAlign="middle">
        <BlockEntity
          number={ item.l1_block_number }
          isLoading={ isLoading }
          fontWeight={ 600 }
          noIcon
          chain={ parentChain }
        />
      </TableCell>
      <TableCell verticalAlign="middle">
        <TxEntity
          isLoading={ isLoading }
          hash={ item.l2_transaction_hash }
          truncation="constant_long"
          noIcon
        />
      </TableCell>
      <TableCell verticalAlign="middle" pr={ 12 }>
        <TimeWithTooltip
          timestamp={ item.l1_block_timestamp }
          isLoading={ isLoading }
          color="text.secondary"
          display="inline-block"
        />
      </TableCell>
      <TableCell verticalAlign="middle">
        <TxEntity
          isLoading={ isLoading }
          hash={ item.l1_transaction_hash }
          truncation="constant_long"
          noIcon
          noCopy
          chain={ parentChain }
        />
      </TableCell>
      <TableCell verticalAlign="middle">
        <AddressEntity
          address={{ hash: item.l1_transaction_origin, name: '', is_contract: false, is_verified: false, ens_domain_name: null, implementations: [] }}
          isLoading={ isLoading }
          truncation="constant"
          noCopy
          chain={ parentChain }
        />
      </TableCell>
      <TableCell verticalAlign="middle" isNumeric>
        <Skeleton loading={ isLoading } color="text.secondary" display="inline-block">
          <span>{ BigNumber(item.l2_transaction_gas_limit).toFormat() }</span>
        </Skeleton>
      </TableCell>
    </TableRow>
  );
};

export default OptimisticDepositsTableItem;
