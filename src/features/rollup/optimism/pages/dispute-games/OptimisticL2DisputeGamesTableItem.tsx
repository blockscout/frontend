// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import BlockEntityL2 from 'src/features/rollup/common/components/BlockEntityL2';

import config from 'src/config';
import { getFeaturePayload } from 'src/config/utils/features';
import TimeWithTooltip from 'src/shared/date-and-time/TimeWithTooltip';
import CopyToClipboard from 'src/shared/texts/CopyToClipboard';

import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'src/toolkit/chakra/table';
import { Truncate } from 'src/toolkit/components/truncation/Truncate';

type Props = { item: schemas['OptimismGame']; isLoading?: boolean };

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
            <Truncate value={ item.contract_address_hash } type="middle-static" maxSymbols={ 16 }/>
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
