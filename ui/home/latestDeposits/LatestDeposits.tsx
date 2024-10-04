import {
  Box,
  Flex,
  Grid,
  GridItem,
  Skeleton,
} from '@chakra-ui/react';
import React from 'react';

import { route } from 'nextjs-routes';

import useIsMobile from 'lib/hooks/useIsMobile';
import BlockEntityL1 from 'ui/shared/entities/block/BlockEntityL1';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';
import LinkInternal from 'ui/shared/links/LinkInternal';
import SocketNewItemsNotice from 'ui/shared/SocketNewItemsNotice';
import TimeAgoWithTooltip from 'ui/shared/TimeAgoWithTooltip';

type DepositsItem = {
  l1BlockNumber: number | null;
  l1TxHash: string | null;
  l2TxHash: string;
  timestamp: string | null;
}

type Props = {
  isLoading?: boolean;
  items: Array<DepositsItem>;
  socketItemsNum: number;
  socketAlert?: string;
}

type ItemProps = {
  item: DepositsItem;
  isLoading?: boolean;
}

const LatestDepositsItem = ({ item, isLoading }: ItemProps) => {
  const isMobile = useIsMobile();

  const l1BlockLink = item.l1BlockNumber ? (
    <BlockEntityL1
      number={ item.l1BlockNumber }
      isLoading={ isLoading }
      fontSize="sm"
      lineHeight={ 5 }
      fontWeight={ 700 }
    />
  ) : (
    <BlockEntityL1
      number="TBD"
      isLoading={ isLoading }
      fontSize="sm"
      lineHeight={ 5 }
      fontWeight={ 700 }
      noLink
    />
  );

  const l1TxLink = item.l1TxHash ? (
    <TxEntityL1
      isLoading={ isLoading }
      hash={ item.l1TxHash }
      fontSize="sm"
      lineHeight={ 5 }
      truncation={ isMobile ? 'constant_long' : 'dynamic' }
    />
  ) : (
    <TxEntityL1
      isLoading={ isLoading }
      hash="To be determined"
      fontSize="sm"
      lineHeight={ 5 }
      truncation="none"
      noLink
    />
  );

  const l2TxLink = (
    <TxEntity
      isLoading={ isLoading }
      hash={ item.l2TxHash }
      fontSize="sm"
      lineHeight={ 5 }
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
                color="text_secondary"
              />
            ) : <GridItem/> }
          </Flex>
          <Grid gridTemplateColumns="56px auto">
            <Skeleton isLoaded={ !isLoading } my="5px" w="fit-content">
              L1 txn
            </Skeleton>
            { l1TxLink }
            <Skeleton isLoaded={ !isLoading } my="3px" w="fit-content">
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
        <Skeleton isLoaded={ !isLoading } w="fit-content" h="fit-content" my="5px">
          L1 txn
        </Skeleton>
        { l1TxLink }
        { item.timestamp ? (
          <TimeAgoWithTooltip
            timestamp={ item.timestamp }
            isLoading={ isLoading }
            color="text_secondary"
            w="fit-content"
            h="fit-content"
            my="2px"
          />
        ) : <GridItem/> }
        <Skeleton isLoaded={ !isLoading } w="fit-content" h="fit-content" my="2px">
          L2 txn
        </Skeleton>
        { l2TxLink }
      </Grid>
    );
  })();

  return (
    <Box
      width="100%"
      borderTop="1px solid"
      borderColor="divider"
      py={ 4 }
      px={{ base: 0, lg: 4 }}
      _last={{ borderBottom: '1px solid', borderColor: 'divider' }}
      fontSize="sm"
      lineHeight={ 5 }
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
        <LinkInternal fontSize="sm" href={ depositsUrl }>View all deposits</LinkInternal>
      </Flex>
    </>
  );
};

export default LatestDeposits;
