import { Stat } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { AddressCoinBalanceHistoryItem } from 'types/api/address';

import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import { WEI, ZERO } from 'toolkit/utils/consts';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';

type Props = AddressCoinBalanceHistoryItem & {
  page: number;
  isLoading: boolean;
};

const AddressCoinBalanceTableItem = (props: Props) => {
  const deltaBn = BigNumber(props.delta).div(WEI);
  const isPositiveDelta = deltaBn.gte(ZERO);

  return (
    <TableRow>
      <TableCell>
        <BlockEntity
          isLoading={ props.isLoading }
          number={ props.block_number }
          noIcon
          fontWeight={ 700 }
        />
      </TableCell>
      <TableCell>
        { props.transaction_hash && (
          <TxEntity
            hash={ props.transaction_hash }
            isLoading={ props.isLoading }
            noIcon
            fontWeight={ 700 }
            maxW="150px"
          />
        ) }
      </TableCell>
      <TableCell>
        <TimeWithTooltip
          timestamp={ props.block_timestamp }
          enableIncrement={ props.page === 1 }
          isLoading={ props.isLoading }
          color="text.secondary"
          display="inline-block"
        />
      </TableCell>
      <TableCell isNumeric pr={ 1 }>
        <Skeleton loading={ props.isLoading } color="text.secondary" display="inline-block">
          <span>{ BigNumber(props.value).div(WEI).dp(8).toFormat() }</span>
        </Skeleton>
      </TableCell>
      <TableCell isNumeric display="flex" justifyContent="end">
        <Skeleton loading={ props.isLoading }>
          <Stat.Root flexGrow="0" size="sm" positive={ isPositiveDelta }>
            <Stat.ValueText fontWeight={ 600 }>
              { deltaBn.dp(8).toFormat() }
            </Stat.ValueText>
            { isPositiveDelta ? <Stat.UpIndicator/> : <Stat.DownIndicator/> }
          </Stat.Root>
        </Skeleton>
      </TableCell>
    </TableRow>
  );
};

export default React.memo(AddressCoinBalanceTableItem);
