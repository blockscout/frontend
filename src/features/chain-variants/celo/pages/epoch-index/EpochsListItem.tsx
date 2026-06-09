// SPDX-License-Identifier: LicenseRef-Blockscout

import { HStack } from '@chakra-ui/react';
import React from 'react';

import type { CeloEpochListItem } from 'src/features/chain-variants/celo/types/api';

import CeloEpochStatus from 'src/features/chain-variants/celo/components/CeloEpochStatus';
import EpochEntity from 'src/features/chain-variants/celo/components/entity/EpochEntity';

import dayjs from 'src/shared/date-and-time/dayjs';
import Time from 'src/shared/date-and-time/Time';
import ListItemMobile from 'src/shared/lists/ListItemMobile';
import TextSeparator from 'src/shared/texts/TextSeparator';
import NativeCoinValue from 'src/shared/values/entity/NativeCoinValue';

import { Skeleton } from 'src/toolkit/chakra/skeleton';

interface Props {
  item: CeloEpochListItem;
  isLoading?: boolean;
}

const EpochsListItem = ({ item, isLoading }: Props) => {
  return (
    <ListItemMobile rowGap={ 1 } py={ 3 } w="full" textStyle="sm" fontWeight={ 500 } alignItems="stretch">
      <HStack minH="30px" gap={ 3 }>
        <EpochEntity number={ String(item.number) } isLoading={ isLoading }/>
        <Skeleton loading={ isLoading } color="text.secondary" fontWeight={ 400 } ml="auto"><span>{ item.type }</span></Skeleton>
        <CeloEpochStatus isFinalized={ item.is_finalized } loading={ isLoading }/>
      </HStack>
      { item.timestamp && (
        <Skeleton loading={ isLoading } display="flex" alignItems="center" minH="30px" color="text.secondary">
          <div>{ dayjs(item.timestamp).fromNow() }</div>
          <TextSeparator/>
          <Time timestamp={ item.timestamp } format="lll_s"/>
        </Skeleton>
      ) }
      <HStack minH="30px">
        <Skeleton loading={ isLoading }>Block range</Skeleton>
        <Skeleton loading={ isLoading } color="text.secondary">
          <span>{ item.start_block_number } - { item.end_block_number || '' }</span>
        </Skeleton>
      </HStack>
      { item.distribution?.community_transfer ? (
        <HStack minH="30px">
          <Skeleton loading={ isLoading }>Community</Skeleton>
          <NativeCoinValue
            amount={ item.distribution?.community_transfer.value }
            loading={ isLoading }
            color="text.secondary"
          />
        </HStack>
      ) : null }
      { item.distribution?.carbon_offsetting_transfer ? (
        <HStack minH="30px">
          <Skeleton loading={ isLoading }>Carbon offset</Skeleton>
          <NativeCoinValue
            amount={ item.distribution?.carbon_offsetting_transfer.value }
            loading={ isLoading }
            color="text.secondary"
          />
        </HStack>
      ) : null }
      { item.distribution?.transfers_total ? (
        <HStack minH="30px">
          <Skeleton loading={ isLoading }>Total</Skeleton>
          <NativeCoinValue
            amount={ item.distribution?.transfers_total.value }
            noSymbol
            loading={ isLoading }
            color="text.secondary"
          />
        </HStack>
      ) : null }
    </ListItemMobile>
  );
};

export default EpochsListItem;
