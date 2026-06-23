// SPDX-License-Identifier: LicenseRef-Blockscout

import { Stat, Flex } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { schemas } from '@blockscout/api-types';
import type { ClusterChainConfig } from 'src/features/multichain/types/client';

import BlockEntity from 'src/slices/block/components/entity/BlockEntity';
import TxEntity from 'src/slices/tx/components/entity/TxEntity';

import TimeWithTooltip from 'src/shared/date-and-time/TimeWithTooltip';
import ListItemMobile from 'src/shared/lists/ListItemMobile';
import NativeCoinValue from 'src/shared/values/entity/NativeCoinValue';
import SimpleValue from 'src/shared/values/entity/SimpleValue';
import { WEI } from 'src/shared/values/entity/utils';

import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { ZERO } from 'src/toolkit/utils/consts';

interface Props {
  data: schemas['CoinBalance'];
  page: number;
  isLoading: boolean;
  chainData?: ClusterChainConfig;
};

const AddressCoinBalanceListItem = ({ data, page, isLoading, chainData }: Props) => {
  const deltaBn = BigNumber(data.delta).div(WEI);
  const isPositiveDelta = deltaBn.gte(ZERO);

  return (
    <ListItemMobile rowGap={ 2 }>
      <Flex justifyContent="space-between" w="100%">
        <NativeCoinValue
          amount={ data.value }
          loading={ isLoading }
          fontWeight={ 600 }
        />
        <Skeleton loading={ isLoading }>
          <Stat.Root flexGrow="0" positive={ isPositiveDelta } size="sm">
            <Stat.ValueText fontWeight={ 600 }>
              <SimpleValue
                value={ deltaBn }
                loading={ isLoading }
              />
            </Stat.ValueText>
            { isPositiveDelta ? <Stat.UpIndicator/> : <Stat.DownIndicator/> }
          </Stat.Root>
        </Skeleton>
      </Flex>
      <Flex columnGap={ 2 } w="100%">
        <Skeleton loading={ isLoading } fontWeight={ 500 } flexShrink={ 0 }>Block</Skeleton>
        <BlockEntity
          isLoading={ isLoading }
          number={ data.block_number }
          noIcon={ !chainData }
          fontWeight={ 700 }
          chain={ chainData }
        />
      </Flex>
      { data.transaction_hash && (
        <Flex columnGap={ 2 } w="100%">
          <Skeleton loading={ isLoading } fontWeight={ 500 } flexShrink={ 0 }>Txs</Skeleton>
          <TxEntity
            hash={ data.transaction_hash }
            isLoading={ isLoading }
            noIcon
            fontWeight={ 700 }
            maxW="150px"
          />
        </Flex>
      ) }
      <Flex columnGap={ 2 } w="100%">
        <Skeleton loading={ isLoading } fontWeight={ 500 } flexShrink={ 0 }>Age</Skeleton>
        <TimeWithTooltip
          timestamp={ data.block_timestamp }
          enableIncrement={ page === 1 }
          isLoading={ isLoading }
          color="text.secondary"
        />
      </Flex>
    </ListItemMobile>
  );
};

export default React.memo(AddressCoinBalanceListItem);
