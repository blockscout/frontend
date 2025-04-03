import { chakra } from '@chakra-ui/react';
import React from 'react';

import type { ScrollL2MessageItem } from 'types/api/scrollL2';

import config from 'configs/app';
import getCurrencyValue from 'lib/getCurrencyValue';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';
import TimeAgoWithTooltip from 'ui/shared/TimeAgoWithTooltip';

const rollupFeature = config.features.rollup;

 type Props = { item: ScrollL2MessageItem; isLoading?: boolean };

const ScrollL2WithdrawalsTableItem = ({ item, isLoading }: Props) => {
  if (!rollupFeature.isEnabled || rollupFeature.type !== 'scroll') {
    return null;
  }

  const { valueStr } = getCurrencyValue({ value: item.value, decimals: String(config.chain.currency.decimals) });
  return (
    <TableRow>
      <TableCell verticalAlign="middle">
        <BlockEntity
          number={ item.origination_transaction_block_number }
          isLoading={ isLoading }
          fontWeight={ 600 }
          noIcon
        />
      </TableCell>
      <TableCell verticalAlign="middle">
        <Skeleton loading={ isLoading }>
          <span>{ item.id }</span>
        </Skeleton>
      </TableCell>
      <TableCell verticalAlign="middle">
        <TxEntity
          isLoading={ isLoading }
          hash={ item.origination_transaction_hash }
          truncation="constant_long"
          noIcon
        />
      </TableCell>
      <TableCell verticalAlign="middle" pr={ 12 }>
        <TimeAgoWithTooltip
          timestamp={ item.origination_timestamp }
          isLoading={ isLoading }
          color="text.secondary"
        />
      </TableCell>
      <TableCell verticalAlign="middle">
        { item.completion_transaction_hash ? (
          <TxEntityL1
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
        <Skeleton loading={ isLoading } display="inline-block">
          <span>{ valueStr }</span>
        </Skeleton>
      </TableCell>
    </TableRow>
  );
};

export default ScrollL2WithdrawalsTableItem;
