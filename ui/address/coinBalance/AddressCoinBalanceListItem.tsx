import { Stat, Flex } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { AddressCoinBalanceHistoryItem } from 'types/api/address';

import { currencyUnits } from 'lib/units';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { WEI, ZERO } from 'toolkit/utils/consts';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';

type Props = AddressCoinBalanceHistoryItem & {
  page: number;
  isLoading: boolean;
};

const AddressCoinBalanceListItem = (props: Props) => {
  const deltaBn = BigNumber(props.delta).div(WEI);
  const isPositiveDelta = deltaBn.gte(ZERO);

  return (
    <ListItemMobile rowGap={ 2 }>
      <Flex justifyContent="space-between" w="100%">
        <Skeleton loading={ props.isLoading } fontWeight={ 600 }>
          { BigNumber(props.value).div(WEI).dp(8).toFormat() } { currencyUnits.ether }
        </Skeleton>
        <Skeleton loading={ props.isLoading }>
          <Stat.Root flexGrow="0" positive={ isPositiveDelta } size="sm">
            <Stat.ValueText fontWeight={ 600 }>
              { deltaBn.dp(8).toFormat() }
            </Stat.ValueText>
            { isPositiveDelta ? <Stat.UpIndicator/> : <Stat.DownIndicator/> }
          </Stat.Root>
        </Skeleton>
      </Flex>
      <Flex columnGap={ 2 } w="100%">
        <Skeleton loading={ props.isLoading } fontWeight={ 500 } flexShrink={ 0 }>Block</Skeleton>
        <BlockEntity
          isLoading={ props.isLoading }
          number={ props.block_number }
          noIcon
          fontWeight={ 700 }
        />
      </Flex>
      { props.transaction_hash && (
        <Flex columnGap={ 2 } w="100%">
          <Skeleton loading={ props.isLoading } fontWeight={ 500 } flexShrink={ 0 }>Txs</Skeleton>
          <TxEntity
            hash={ props.transaction_hash }
            isLoading={ props.isLoading }
            noIcon
            fontWeight={ 700 }
            maxW="150px"
          />
        </Flex>
      ) }
      <Flex columnGap={ 2 } w="100%">
        <Skeleton loading={ props.isLoading } fontWeight={ 500 } flexShrink={ 0 }>Age</Skeleton>
        <TimeWithTooltip
          timestamp={ props.block_timestamp }
          enableIncrement={ props.page === 1 }
          isLoading={ props.isLoading }
          color="text.secondary"
        />
      </Flex>
    </ListItemMobile>
  );
};

export default React.memo(AddressCoinBalanceListItem);
