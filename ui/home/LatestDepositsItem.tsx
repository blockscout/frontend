import {
  Box,
  Flex,
  Grid,
  Skeleton,
} from '@chakra-ui/react';
import React from 'react';

import type { L2DepositsItem } from 'types/api/l2Deposits';

import config from 'configs/app';
import dayjs from 'lib/date/dayjs';
import useIsMobile from 'lib/hooks/useIsMobile';
import BlockEntityL1 from 'ui/shared/entities/block/BlockEntityL1';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';

const feature = config.features.optimisticRollup;

type Props = {
  item: L2DepositsItem;
  isLoading?: boolean;
}

const LatestTxsItem = ({ item, isLoading }: Props) => {
  const timeAgo = dayjs(item.l1_block_timestamp).fromNow();
  const isMobile = useIsMobile();

  if (!feature.isEnabled) {
    return null;
  }

  const l1BlockLink = (
    <BlockEntityL1
      number={ item.l1_block_number }
      isLoading={ isLoading }
      fontSize="sm"
      lineHeight={ 5 }
      fontWeight={ 700 }
    />
  );

  const l1TxLink = (
    <TxEntityL1
      isLoading={ isLoading }
      hash={ item.l1_tx_hash }
      fontSize="sm"
      lineHeight={ 5 }
    />
  );

  const l2TxLink = (
    <TxEntity
      isLoading={ isLoading }
      hash={ item.l2_tx_hash }
      fontSize="sm"
      lineHeight={ 5 }
    />
  );

  const content = (() => {
    if (isMobile) {
      return (
        <>
          <Flex justifyContent="space-between" alignItems="center" mb={ 1 }>
            { l1BlockLink }
            <Skeleton isLoaded={ !isLoading } color="text_secondary">
              <span>{ timeAgo }</span>
            </Skeleton>
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
        <Skeleton isLoaded={ !isLoading } color="text_secondary" w="fit-content" h="fit-content" my="2px">
          <span>{ timeAgo }</span>
        </Skeleton>
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

export default React.memo(LatestTxsItem);
