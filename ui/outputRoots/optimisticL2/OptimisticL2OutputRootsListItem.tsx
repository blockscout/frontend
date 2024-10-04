import { Flex, Skeleton } from '@chakra-ui/react';
import React from 'react';

import type { OptimisticL2OutputRootsItem } from 'types/api/optimisticL2';

import config from 'configs/app';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import BlockEntityL2 from 'ui/shared/entities/block/BlockEntityL2';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';
import HashStringShorten from 'ui/shared/HashStringShorten';
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';
import TimeAgoWithTooltip from 'ui/shared/TimeAgoWithTooltip';

const rollupFeature = config.features.rollup;

type Props = { item: OptimisticL2OutputRootsItem; isLoading?: boolean };

const OptimisticL2OutputRootsListItem = ({ item, isLoading }: Props) => {
  if (!rollupFeature.isEnabled || rollupFeature.type !== 'optimistic') {
    return null;
  }

  return (
    <ListItemMobileGrid.Container>

      <ListItemMobileGrid.Label isLoading={ isLoading }>L2 output index</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value fontWeight={ 600 } color="text">
        <Skeleton isLoaded={ !isLoading } display="inline-block">{ item.l2_output_index }</Skeleton>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Age</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <TimeAgoWithTooltip
          timestamp={ item.l1_timestamp }
          isLoading={ isLoading }
          display="inline-block"
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>L2 block #</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <BlockEntityL2
          isLoading={ isLoading }
          number={ item.l2_block_number }
          fontSize="sm"
          lineHeight={ 5 }
          noIcon
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>L1 txn hash</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value py="3px">
        <TxEntityL1
          isLoading={ isLoading }
          hash={ item.l1_tx_hash }
          fontSize="sm"
          lineHeight={ 5 }
          truncation="constant_long"
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Output root</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Flex overflow="hidden" whiteSpace="nowrap" alignItems="center" w="100%" justifyContent="start">
          <Skeleton isLoaded={ !isLoading } color="text_secondary">
            <HashStringShorten hash={ item.output_root } type="long"/>
          </Skeleton>
          <CopyToClipboard text={ item.output_root } isLoading={ isLoading }/>
        </Flex>
      </ListItemMobileGrid.Value>

    </ListItemMobileGrid.Container>
  );
};

export default OptimisticL2OutputRootsListItem;
