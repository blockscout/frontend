import {
  Box,
  Flex,
  Skeleton,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import React from 'react';

import type { ZkEvmL2TxnBatchesItem } from 'types/api/zkEvml2TxnBatches';

import { route } from 'nextjs-routes';

import BlockTimestamp from 'ui/blocks/BlockTimestamp';
import BlockEntityL2 from 'ui/shared/entities/block/BlockEntityL2';
import ZkEvmL2TxnBatchStatus from 'ui/shared/statusTag/ZkEvmL2TxnBatchStatus';

type Props = {
  batch: ZkEvmL2TxnBatchesItem;
  isLoading?: boolean;
}

const LatestZkevmL2BatchItem = ({ batch, isLoading }: Props) => {
  return (
    <Box
      as={ motion.div }
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ display: 'none' }}
      transitionDuration="normal"
      transitionTimingFunction="linear"
      borderRadius="md"
      border="1px solid"
      borderColor="divider"
      p={ 6 }
    >
      <Flex alignItems="center" overflow="hidden" w="100%" mb={ 3 }>
        <BlockEntityL2
          isLoading={ isLoading }
          number={ batch.number }
          tailLength={ 2 }
          fontSize="xl"
          lineHeight={ 7 }
          fontWeight={ 500 }
          mr="auto"
          href={ route({ pathname: '/zkevm-l2-txn-batch/[number]', query: { number: batch.number.toString() } }) }
        />
        <BlockTimestamp
          ts={ batch.timestamp }
          isEnabled={ !isLoading }
          isLoading={ isLoading }
          fontSize="sm"
          flexShrink={ 0 }
          ml={ 2 }
        />
      </Flex>
      <Flex alignItems="center" justifyContent="space-between" w="100%" flexWrap="wrap">
        <Flex alignItems="center">
          <Skeleton isLoaded={ !isLoading } mr={ 2 }>Txn</Skeleton>
          { /* LINK!!! */ }
          <Skeleton isLoaded={ !isLoading } color="text_secondary"><span>{ batch.tx_count }</span></Skeleton>
        </Flex>
        <ZkEvmL2TxnBatchStatus status={ batch.status } isLoading={ isLoading }/>
      </Flex>
    </Box>
  );
};

export default LatestZkevmL2BatchItem;
