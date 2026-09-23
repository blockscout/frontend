// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, Flex, VStack } from '@chakra-ui/react';
import { route } from 'nextjs-routes';
import React from 'react';

import SocketNewItemsNotice from 'src/api/socket/SocketNewItemsNotice';

import TxEntity from 'src/slices/tx/components/entity/TxEntity';

import BlockEntityL1 from 'src/features/rollup/common/components/BlockEntityL1';
import TxEntityL1 from 'src/features/rollup/common/components/TxEntityL1';
import { layerLabels } from 'src/features/rollup/common/utils/layer';

import TimeWithTooltip from 'src/shared/date-and-time/TimeWithTooltip';

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
    <BlockEntityL1
      number={ item.l1BlockNumber }
      isLoading={ isLoading }
      fontWeight={ 700 }
    />
  ) : (
    <BlockEntityL1
      number="TBD"
      isLoading={ isLoading }
      fontWeight={ 700 }
      noLink
    />
  );

  const l1TxLink = item.l1TxHash ? (
    <TxEntityL1
      isLoading={ isLoading }
      hash={ item.l1TxHash }
      truncation="dynamic"
      noCopy
    />
  ) : (
    <TxEntityL1
      isLoading={ isLoading }
      hash="To be determined"
      truncation="none"
      noLink
      noCopy
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

const LatestDeposits = ({ isLoading, items, showSocketErrorAlert, socketItemsNum }: Props) => {
  const depositsUrl = route({ pathname: '/deposits' });
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
                  key={ (item.l1TxHash ?? '') + (item.l2TxHash ?? '') + (isLoading ? index : '') }
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
