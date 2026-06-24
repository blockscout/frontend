// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';
import TxEntity from 'src/slices/tx/components/entity/TxEntity';

import TxEntityL1 from 'src/features/rollup/common/components/TxEntityL1';

import config from 'src/config';
import dayjs from 'src/shared/date-and-time/dayjs';
import TimeWithTooltip from 'src/shared/date-and-time/TimeWithTooltip';

import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'src/toolkit/chakra/table';

import OptimisticL2WithdrawalsItemStatus from './OptimisticL2WithdrawalsItemStatus';

const rollupFeature = config.features.rollup;

type Props = { item: schemas['OptimismWithdrawal']; isLoading?: boolean };

const OptimisticL2WithdrawalsTableItem = ({ item, isLoading }: Props) => {
  const timeToEnd = item.challenge_period_end ? dayjs(item.challenge_period_end).fromNow(true) + ' left' : '';

  if (!rollupFeature.isEnabled || rollupFeature.type !== 'optimistic') {
    return null;
  }

  return (
    <TableRow>
      <TableCell verticalAlign="middle" fontWeight={ 600 }>
        <Skeleton loading={ isLoading } display="inline-block">{ item.msg_nonce_version + '-' + item.msg_nonce }</Skeleton>
      </TableCell>
      <TableCell verticalAlign="middle">
        { item.from ? (
          <AddressEntity
            address={ item.from }
            isLoading={ isLoading }
            truncation="constant"
          />
        ) : 'N/A' }
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
          timestamp={ item.l2_timestamp }
          fallbackText="N/A"
          isLoading={ isLoading }
          display="inline-block"
          color="text.secondary"
        />
      </TableCell>
      <TableCell verticalAlign="middle">
        <OptimisticL2WithdrawalsItemStatus data={ item } isLoading={ isLoading }/>
      </TableCell>
      <TableCell verticalAlign="middle">
        { item.l1_transaction_hash ? (
          <TxEntityL1
            isLoading={ isLoading }
            hash={ item.l1_transaction_hash }
            truncation="constant_long"
            noIcon
            noCopy
          />
        ) :
          'N/A'
        }
      </TableCell>
      <TableCell verticalAlign="middle">
        <Skeleton loading={ isLoading } color="text.secondary" minW="50px" minH="20px" display="inline-block">{ timeToEnd }</Skeleton>
      </TableCell>
    </TableRow>
  );
};

export default OptimisticL2WithdrawalsTableItem;
