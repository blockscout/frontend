import {
  Box,
  Flex,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import React from 'react';

import { route } from 'nextjs-routes';

import useIsMobile from 'lib/hooks/useIsMobile';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import BlockEntityL1 from 'ui/shared/entities/block/BlockEntityL1';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';
import SocketNewItemsNotice from 'ui/shared/SocketNewItemsNotice';
import TimeAgoWithTooltip from 'ui/shared/TimeAgoWithTooltip';

type DepositsItem = {
  l1BlockNumber: number | null;
  l1TxHash: string | null;
  l2TxHash: string;
  timestamp: string | null;
};

type Props = {
  isLoading?: boolean;
  items: Array<DepositsItem>;
  socketItemsNum: number;
  socketAlert?: string;
};

type ItemProps = {
  item: DepositsItem;
  isLoading?: boolean;
};

const LatestDepositsItem = ({ item, isLoading }: ItemProps) => {
  const isMobile = useIsMobile();

  const l1BlockLink = item.l1BlockNumber ? (
    <BlockEntityL1
      number={ item.l1BlockNumber }
      isLoading={ isLoading }
      textStyle="sm"
      fontWeight={ 700 }
    />
  ) : (
    <BlockEntityL1
      number="TBD"
      isLoading={ isLoading }
      textStyle="sm"
      fontWeight={ 700 }
      noLink
    />
  );

  const l1TxLink = item.l1TxHash ? (
    <TxEntityL1
      isLoading={ isLoading }
      hash={ item.l1TxHash }
      textStyle="sm"
      truncation={ isMobile ? 'constant_long' : 'dynamic' }
    />
  ) : (
    <TxEntityL1
      isLoading={ isLoading }
      hash="To be determined"
      textStyle="sm"
      truncation="none"
      noLink
    />
  );

  const l2TxLink = (
    <TxEntity
      isLoading={ isLoading }
      hash={ item.l2TxHash }
      textStyle="sm"
      truncation={ isMobile ? 'constant_long' : 'dynamic' }
    />
  );

  const content = (() => {
    if (isMobile) {
      return (
        <>
          <Flex justifyContent="space-between" alignItems="center" mb={ 1 }>
            { l1BlockLink }
            { item.timestamp ? (
              <TimeAgoWithTooltip
                timestamp={ item.timestamp }
                isLoading={ isLoading }
                color="text.secondary"
              />
            ) : <GridItem/> }
          </Flex>
          <Grid gridTemplateColumns="56px auto">
            <Skeleton loading={ isLoading } my="5px" w="fit-content">
              L1 txn
            </Skeleton>
            { l1TxLink }
            <Skeleton loading={ isLoading } my="3px" w="fit-content">
              L2 txn
            </Skeleton>
            { l2TxLink }
          </Grid>
        </>
      );
    }

    return (
      <Grid width="100%" columnGap={ 4 } rowGap={ 2 } templateColumns="max-content max-content auto" w="100%">
        { l1BlockLink }
        <Skeleton loading={ isLoading } w="fit-content" h="fit-content" my="5px">
          L1 txn
        </Skeleton>
        { l1TxLink }
        { item.timestamp ? (
          <TimeAgoWithTooltip
            timestamp={ item.timestamp }
            isLoading={ isLoading }
            color="text.secondary"
            w="fit-content"
            h="fit-content"
            my="2px"
          />
        ) : <GridItem/> }
        <Skeleton loading={ isLoading } w="fit-content" h="fit-content" my="2px">
          L2 txn
        </Skeleton>
        { l2TxLink }
      </Grid>
    );
  })();

  return (
    <Box
      width="100%"
      borderBottom="1px solid"
      borderColor="border.divider"
      py={ 4 }
      px={{ base: 0, lg: 4 }}
      textStyle="sm"
    >
      { content }
    </Box>
  );
};

const LatestDeposits = ({ isLoading, items, socketAlert, socketItemsNum }: Props) => {
  const depositsUrl = route({ pathname: '/deposits' });
  return (
    <>
      <SocketNewItemsNotice borderBottomRadius={ 0 } url={ depositsUrl } num={ socketItemsNum } alert={ socketAlert } type="deposit" isLoading={ isLoading }/>
      <Box mb={{ base: 3, lg: 4 }}>
        { items.map(((item, index) => (
          <LatestDepositsItem
            key={ item.l1TxHash + item.l2TxHash + (isLoading ? index : '') }
            item={ item }
            isLoading={ isLoading }
          />
        ))) }
      </Box>
      <Flex justifyContent="center">
        <Link textStyle="sm" href={ depositsUrl }>View all deposits</Link>
      </Flex>
    </>
  );
};

export default LatestDeposits;
