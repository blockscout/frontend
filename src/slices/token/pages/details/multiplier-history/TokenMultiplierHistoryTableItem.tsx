// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';

import BlockEntity from 'src/slices/block/components/entity/BlockEntity';
import TokenMultiplierChangeStatusTag from 'src/slices/token/components/ui-multiplier/TokenMultiplierChangeStatusTag';
import TokenMultiplierChangeValue from 'src/slices/token/components/ui-multiplier/TokenMultiplierChangeValue';
import type { UiMultiplierChangeStatus } from 'src/slices/token/utils/ui-multiplier';
import TxEntity from 'src/slices/tx/components/entity/TxEntity';

import TimeWithTooltip from 'src/shared/date-and-time/TimeWithTooltip';

import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'src/toolkit/chakra/table';

interface Props {
  data: schemas['TokenUIMultiplierChange'];
  status: UiMultiplierChangeStatus;
  page: number;
  isLoading?: boolean;
}

const TokenMultiplierHistoryTableItem = ({ data, status, page, isLoading }: Props) => {
  return (
    <TableRow>
      <TableCell verticalAlign="middle">
        { data.transaction_hash ? (
          <TxEntity
            hash={ data.transaction_hash }
            isLoading={ isLoading }
            noIcon
            fontWeight={ 700 }
            truncation="constant_long"
          />
        ) : (
          <Skeleton loading={ isLoading } display="inline-block" color="text.secondary">N/A</Skeleton>
        ) }
      </TableCell>
      <TableCell verticalAlign="middle">
        <TimeWithTooltip
          timestamp={ data.timestamp }
          enableIncrement={ page === 1 }
          isLoading={ isLoading }
          color="text.secondary"
          display="inline-block"
        />
      </TableCell>
      <TableCell verticalAlign="middle">
        <BlockEntity
          number={ data.block_number }
          isLoading={ isLoading }
          noIcon
        />
      </TableCell>
      <TableCell verticalAlign="middle">
        <TokenMultiplierChangeValue
          oldMultiplier={ data.old_multiplier }
          newMultiplier={ data.new_multiplier }
          isLoading={ isLoading }
        />
      </TableCell>
      <TableCell verticalAlign="middle">
        <TimeWithTooltip
          timestamp={ data.effective_at }
          enableIncrement={ page === 1 }
          isLoading={ isLoading }
          color="text.secondary"
          display="inline-block"
        />
      </TableCell>
      <TableCell verticalAlign="middle">
        <TokenMultiplierChangeStatusTag status={ status } isLoading={ isLoading }/>
      </TableCell>
    </TableRow>
  );
};

export default React.memo(TokenMultiplierHistoryTableItem);
