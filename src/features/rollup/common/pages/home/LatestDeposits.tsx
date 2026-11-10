// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, Flex, VStack } from '@chakra-ui/react';
import React from 'react';

import SocketNewItemsNotice from 'src/api/socket/SocketNewItemsNotice';

import BlockEntity from 'src/slices/block/components/entity/BlockEntity';
import TxEntity from 'src/slices/tx/components/entity/TxEntity';

import { layerLabels } from 'src/features/rollup/common/utils/layer';
import { parentChain } from 'src/features/rollup/common/utils/parent-chain-entity';

import TimeWithTooltip from 'src/shared/date-and-time/TimeWithTooltip';
import { useUniqueKeys } from 'src/shared/lists/get-unique-keys';
import { route } from 'src/shared/router/routes';

import { Link } from 'src/toolkit/chakra/link';
import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { TableBody, TableCell, TableContainerScrollable, TableRoot, TableRow } from 'src/toolkit/chakra/table';

const LATEST_DEPOSITS_TABLE_MIN_WIDTH = '750px';

interface DepositsItem {
  l1BlockNumber: number | null;
  l1TxHash: string | null;
  l2TxHash: string | null;
  timestamp: string | null;
};

interface Props {
  isLoading?: boolean;
  items: Array<DepositsItem>;
  socketItemsNum: number;
  showSocketErrorAlert?: boolean;
};

interface ItemProps {
  item: DepositsItem;
  isLoading?: boolean;
};

const LatestDepositsItem = ({ item, isLoading }: ItemProps) => {
  const l1BlockLink = item.l1BlockNumber ? (
    <BlockEntity
      number={ item.l1BlockNumber }
      isLoading={ isLoading }
      fontWeight={ 700 }
      chain={ parentChain }
    />
  ) : (
    <BlockEntity
      number="TBD"
      isLoading={ isLoading }
      fontWeight={ 700 }
      noLink
      chain={ parentChain }
    />
  );

  const l1TxLink = item.l1TxHash ? (
    <TxEntity
      isLoading={ isLoading }
      hash={ item.l1TxHash }
      truncation="dynamic"
      noCopy
      chain={ parentChain }
    />
  ) : (
    <TxEntity
      isLoading={ isLoading }
      hash="To be determined"
      truncation="none"
      noLink
      noCopy
      chain={ parentChain }
    />
  );

  const l2TxLink = item.l2TxHash ? (
    <TxEntity
      isLoading={ isLoading }
      hash={ item.l2TxHash }
      truncation="dynamic"
    />
  ) : (
    <TxEntity
      isLoading={ isLoading }
      hash="To be determined"
      truncation="none"
      noLink
      noCopy
    />
  );

  return (
    <TableRow>
      <TableCell w="130px">
        <VStack alignItems="start" gap={ 2 }>
          { l1BlockLink }
          { item.timestamp && (
            <TimeWithTooltip
              timestamp={ item.timestamp }
              timeFormat="relative"
              isLoading={ isLoading }
              color="text.secondary"
              w="fit-content"
              h="fit-content"
            />
          ) }
        </VStack>
      </TableCell>
      <TableCell w="80px">
        <VStack alignItems="start" gap={ 2 }>
          <Skeleton loading={ isLoading } w="fit-content" h="fit-content">
            { layerLabels.parent } txn
          </Skeleton>
          <Skeleton loading={ isLoading } w="fit-content" h="fit-content">
            { layerLabels.current } txn
          </Skeleton>
        </VStack>
      </TableCell>
      <TableCell>
        <VStack alignItems="stretch" gap={ 2 } overflow="hidden">
          { l1TxLink }
          { l2TxLink }
        </VStack>
      </TableCell>
    </TableRow>
  );
};

const getBaseKey = (item: DepositsItem): string => (item.l1TxHash ?? '') + (item.l2TxHash ?? '');

const LatestDeposits = ({ isLoading, items, showSocketErrorAlert, socketItemsNum }: Props) => {
  const depositsUrl = route({ pathname: '/deposits' });
  const keys = useUniqueKeys(items, getBaseKey);

  return (
    <>
      <Box mb={{ base: 3, lg: 4 }} textStyle="sm">
        <TableContainerScrollable>
          <SocketNewItemsNotice
            borderBottomRadius={ 0 }
            minW={ LATEST_DEPOSITS_TABLE_MIN_WIDTH }
            url={ depositsUrl }
            num={ socketItemsNum }
            showErrorAlert={ showSocketErrorAlert }
            type="deposit"
            isLoading={ isLoading }
          />
          <TableRoot minW={ LATEST_DEPOSITS_TABLE_MIN_WIDTH }>
            <TableBody>
              { items.map(((item, index) => (
                <LatestDepositsItem
                  key={ keys[index] }
                  item={ item }
                  isLoading={ isLoading }
                />
              ))) }
            </TableBody>
          </TableRoot>
        </TableContainerScrollable>
      </Box>
      <Flex justifyContent="center">
        <Link textStyle="sm" href={ depositsUrl }>View all deposits</Link>
      </Flex>
    </>
  );
};

export default LatestDeposits;
