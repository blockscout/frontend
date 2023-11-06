import { Flex, Td, Tr, Skeleton } from '@chakra-ui/react';
import React from 'react';

import type { L2OutputRootsItem } from 'types/api/l2OutputRoots';

import config from 'configs/app';
import dayjs from 'lib/date/dayjs';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import BlockEntityL2 from 'ui/shared/entities/block/BlockEntityL2';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';

const feature = config.features.optimisticRollup;

type Props = { item: L2OutputRootsItem; isLoading?: boolean };

const OutputRootsTableItem = ({ item, isLoading }: Props) => {
  const timeAgo = dayjs(item.l1_timestamp).fromNow();

  if (!feature.isEnabled) {
    return null;
  }

  return (
    <Tr>
      <Td verticalAlign="middle">
        <Skeleton isLoaded={ !isLoading } display="inline-block">{ item.l2_output_index }</Skeleton>
      </Td>
      <Td verticalAlign="middle">
        <Skeleton isLoaded={ !isLoading } color="text_secondary" display="inline-block"><span>{ timeAgo }</span></Skeleton>
      </Td>
      <Td verticalAlign="middle">
        <BlockEntityL2
          isLoading={ isLoading }
          number={ item.l2_block_number }
          fontSize="sm"
          lineHeight={ 5 }
          fontWeight={ 600 }
        />
      </Td>
      <Td verticalAlign="middle" pr={ 12 }>
        <TxEntityL1
          isLoading={ isLoading }
          hash={ item.l1_tx_hash }
          fontSize="sm"
          lineHeight={ 5 }
        />
      </Td>
      <Td verticalAlign="middle">
        <Flex overflow="hidden" whiteSpace="nowrap" w="100%" alignItems="center">
          <Skeleton isLoaded={ !isLoading } w="calc(100% - 36px)">
            <HashStringShortenDynamic hash={ item.output_root }/>
          </Skeleton>
          <CopyToClipboard text={ item.output_root } ml={ 2 } isLoading={ isLoading }/>
        </Flex>
      </Td>
    </Tr>
  );
};

export default OutputRootsTableItem;
