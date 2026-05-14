// SPDX-License-Identifier: LicenseRef-Blockscout

import { Stat } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { AddressCoinBalanceHistoryItem } from 'client/slices/address/types/api';
import type { ClusterChainConfig } from 'types/multichain';

import BlockEntity from 'client/slices/block/components/entity/BlockEntity';
import TxEntity from 'client/slices/tx/components/entity/TxEntity';

import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import { ZERO } from 'toolkit/utils/consts';
import ChainIcon from 'ui/shared/externalChains/ChainIcon';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';
import NativeCoinValue from 'ui/shared/value/NativeCoinValue';
import SimpleValue from 'ui/shared/value/SimpleValue';
import { WEI } from 'ui/shared/value/utils';

type Props = AddressCoinBalanceHistoryItem & {
  page: number;
  isLoading: boolean;
  chainData?: ClusterChainConfig;
};

const AddressCoinBalanceTableItem = (props: Props) => {
  const deltaBn = BigNumber(props.delta).div(WEI);
  const isPositiveDelta = deltaBn.gte(ZERO);

  return (
    <TableRow>
      { props.chainData && (
        <TableCell>
          <ChainIcon data={ props.chainData } isLoading={ props.isLoading }/>
        </TableCell>
      ) }
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
        <NativeCoinValue
          amount={ props.value }
          noSymbol
          loading={ props.isLoading }
          color="text.secondary"
        />
      </TableCell>
      <TableCell isNumeric display="flex" justifyContent="end">
        <Skeleton loading={ props.isLoading }>
          <Stat.Root flexGrow="0" size="sm" positive={ isPositiveDelta }>
            <Stat.ValueText fontWeight={ 600 }>
              <SimpleValue
                value={ deltaBn }
                loading={ props.isLoading }
              />
            </Stat.ValueText>
            { isPositiveDelta ? <Stat.UpIndicator/> : <Stat.DownIndicator/> }
          </Stat.Root>
        </Skeleton>
      </TableCell>
    </TableRow>
  );
};

export default React.memo(AddressCoinBalanceTableItem);
