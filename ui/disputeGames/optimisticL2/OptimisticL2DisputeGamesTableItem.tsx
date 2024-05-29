import { Flex, Td, Tr, Skeleton } from '@chakra-ui/react';
import React from 'react';

import type { OptimisticL2DisputeGamesItem } from 'types/api/optimisticL2';

import config from 'configs/app';
import dayjs from 'lib/date/dayjs';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import BlockEntityL2 from 'ui/shared/entities/block/BlockEntityL2';
import HashStringShorten from 'ui/shared/HashStringShorten';

const faultProofSystemFeature = config.features.faultProofSystem;

type Props = { item: OptimisticL2DisputeGamesItem; isLoading?: boolean };

const OptimisticL2DisputeGamesTableItem = ({ item, isLoading }: Props) => {
  if (!faultProofSystemFeature.isEnabled) {
    return null;
  }

  return (
    <Tr>
      <Td verticalAlign="middle">
        <Skeleton isLoaded={ !isLoading } display="inline-block">{ item.index }</Skeleton>
      </Td>
      <Td verticalAlign="middle">
        <Skeleton isLoaded={ !isLoading } display="inline-block">{ item.game_type }</Skeleton>
      </Td>
      <Td verticalAlign="middle">
        <Flex overflow="hidden" w="100%" alignItems="center">
          <Skeleton isLoaded={ !isLoading }>
            <HashStringShorten hash={ item.contract_address } type="long"/>
          </Skeleton>
          <CopyToClipboard text={ item.contract_address } ml={ 2 } isLoading={ isLoading }/>
        </Flex>
      </Td>
      <Td verticalAlign="middle">
        <BlockEntityL2
          isLoading={ isLoading }
          number={ item.l2_block_number }
          fontSize="sm"
          lineHeight={ 5 }
          noIcon
        />
      </Td>
      <Td verticalAlign="middle">
        <Skeleton isLoaded={ !isLoading } display="inline-block">{ dayjs(item.created_at).fromNow() }</Skeleton>
      </Td>
      <Td verticalAlign="middle">
        <Skeleton isLoaded={ !isLoading } display="inline-block">{ item.status }</Skeleton>
      </Td>
      <Td>
        <Skeleton isLoaded={ !isLoading } display="inline-block">
          { item.resolved_at ? dayjs(item.resolved_at).fromNow() : 'N/A' }
        </Skeleton>
      </Td>
    </Tr>
  );
};

export default OptimisticL2DisputeGamesTableItem;
