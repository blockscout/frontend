// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { OptimisticL2DisputeGamesItem } from 'client/features/rollup/optimism/types/api';

import BlockEntityL2 from 'client/features/rollup/common/components/BlockEntityL2';

import config from 'client/config';
import { getFeaturePayload } from 'client/config/utils/features';
import TimeWithTooltip from 'client/shared/date-and-time/TimeWithTooltip';
import CopyToClipboard from 'client/shared/texts/CopyToClipboard';
import HashStringShorten from 'client/shared/texts/HashStringShorten';

import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'toolkit/chakra/table';

type Props = { item: OptimisticL2DisputeGamesItem; isLoading?: boolean };

const OptimisticL2DisputeGamesTableItem = ({ item, isLoading }: Props) => {
  if (!getFeaturePayload(config.features.rollup)?.faultProofSystemEnabled) {
    return null;
  }

  return (
    <TableRow>
      <TableCell verticalAlign="middle">
        <Skeleton loading={ isLoading } display="inline-block">{ item.index }</Skeleton>
      </TableCell>
      <TableCell verticalAlign="middle">
        <Skeleton loading={ isLoading } display="inline-block">{ item.game_type }</Skeleton>
      </TableCell>
      <TableCell verticalAlign="middle">
        <Flex overflow="hidden" w="100%" alignItems="center">
          <Skeleton loading={ isLoading }>
            <HashStringShorten hash={ item.contract_address_hash } type="long"/>
          </Skeleton>
          <CopyToClipboard text={ item.contract_address_hash } ml={ 2 } isLoading={ isLoading }/>
        </Flex>
      </TableCell>
      <TableCell verticalAlign="middle">
        <BlockEntityL2
          isLoading={ isLoading }
          number={ item.l2_block_number }
          noIcon
        />
      </TableCell>
      <TableCell verticalAlign="middle">
        <TimeWithTooltip
          timestamp={ item.created_at }
          isLoading={ isLoading }
          display="inline-block"
        />
      </TableCell>
      <TableCell verticalAlign="middle">
        <Skeleton loading={ isLoading } display="inline-block">{ item.status }</Skeleton>
      </TableCell>
      <TableCell>
        <TimeWithTooltip
          timestamp={ item.resolved_at }
          fallbackText="N/A"
          isLoading={ isLoading }
          display="inline-block"
        />
      </TableCell>
    </TableRow>
  );
};

export default OptimisticL2DisputeGamesTableItem;
