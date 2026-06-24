// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import TxEntity from 'src/slices/tx/components/entity/TxEntity';

import BlockEntityL1 from 'src/features/rollup/common/components/BlockEntityL1';
import TxEntityL1 from 'src/features/rollup/common/components/TxEntityL1';

import config from 'src/config';
import TimeWithTooltip from 'src/shared/date-and-time/TimeWithTooltip';
import NativeCoinValue from 'src/shared/values/entity/NativeCoinValue';

import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'src/toolkit/chakra/table';

const rollupFeature = config.features.rollup;

type Props = { item: schemas['ScrollBridge']; isLoading?: boolean };

const ScrollL2DepositsTableItem = ({ item, isLoading }: Props) => {
  if (!rollupFeature.isEnabled || rollupFeature.type !== 'scroll') {
    return null;
  }

  return (
    <TableRow>
      <TableCell verticalAlign="middle">
        { item.origination_transaction_block_number ? (
          <BlockEntityL1
            number={ item.origination_transaction_block_number }
            isLoading={ isLoading }
            fontWeight={ 600 }
            noIcon
          />
        ) : '-' }
      </TableCell>
      <TableCell verticalAlign="middle">
        <Skeleton loading={ isLoading }>
          <span>{ item.id }</span>
        </Skeleton>
      </TableCell>
      <TableCell verticalAlign="middle">
        { item.origination_transaction_hash ? (
          <TxEntityL1
            isLoading={ isLoading }
            hash={ item.origination_transaction_hash }
            truncation="constant_long"
            noIcon
            noCopy
          />
        ) : '-' }
      </TableCell>
      <TableCell verticalAlign="middle" pr={ 12 }>
        <TimeWithTooltip
          timestamp={ item.origination_timestamp }
          isLoading={ isLoading }
          color="text.secondary"
        />
      </TableCell>
      <TableCell verticalAlign="middle">
        { item.completion_transaction_hash ? (
          <TxEntity
            isLoading={ isLoading }
            hash={ item.completion_transaction_hash }
            truncation="constant_long"
            noIcon
          />
        ) : (
          <chakra.span color="text.secondary">
            Pending Claim
          </chakra.span>
        ) }
      </TableCell>
      <TableCell verticalAlign="middle" isNumeric>
        <NativeCoinValue
          amount={ item.value }
          noSymbol
          loading={ isLoading }
        />
      </TableCell>
    </TableRow>
  );
};

export default ScrollL2DepositsTableItem;
