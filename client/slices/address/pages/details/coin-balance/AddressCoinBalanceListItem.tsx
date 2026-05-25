// SPDX-License-Identifier: LicenseRef-Blockscout

import { Stat, Flex } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { ClusterChainConfig } from 'client/features/multichain/types/client';
import type { AddressCoinBalanceHistoryItem } from 'client/slices/address/types/api';

import BlockEntity from 'client/slices/block/components/entity/BlockEntity';
import TxEntity from 'client/slices/tx/components/entity/TxEntity';

import TimeWithTooltip from 'client/shared/date-and-time/TimeWithTooltip';
import ListItemMobile from 'client/shared/lists/ListItemMobile';
import NativeCoinValue from 'client/shared/values/entity/NativeCoinValue';
import SimpleValue from 'client/shared/values/entity/SimpleValue';
import { WEI } from 'client/shared/values/entity/utils';

import { Skeleton } from 'toolkit/chakra/skeleton';
import { ZERO } from 'toolkit/utils/consts';

type Props = AddressCoinBalanceHistoryItem & {
  page: number;
  isLoading: boolean;
  chainData?: ClusterChainConfig;
};

const AddressCoinBalanceListItem = (props: Props) => {
  const deltaBn = BigNumber(props.delta).div(WEI);
  const isPositiveDelta = deltaBn.gte(ZERO);

  return (
    <ListItemMobile rowGap={ 2 }>
      <Flex justifyContent="space-between" w="100%">
        <NativeCoinValue
          amount={ props.value }
          loading={ props.isLoading }
          fontWeight={ 600 }
        />
        <Skeleton loading={ props.isLoading }>
          <Stat.Root flexGrow="0" positive={ isPositiveDelta } size="sm">
            <Stat.ValueText fontWeight={ 600 }>
              <SimpleValue
                value={ deltaBn }
                loading={ props.isLoading }
              />
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
          noIcon={ !props.chainData }
          fontWeight={ 700 }
          chain={ props.chainData }
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
