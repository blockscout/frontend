import {
  Box,
  Flex,
  Skeleton,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import React from 'react';

import { route } from 'nextjs-routes';

import BatchEntityL2 from 'ui/shared/entities/block/BatchEntityL2';
import LinkInternal from 'ui/shared/links/LinkInternal';
import TimeAgoWithTooltip from 'ui/shared/TimeAgoWithTooltip';

type Props = {
  number: number;
  timestamp: string | null;
  txCount: number;
  status?: React.ReactNode;
  isLoading: boolean;
};

const LatestBatchItem = ({ number, timestamp, txCount, status, isLoading }: Props) => {
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
      p={ 3 }
    >
      <Flex alignItems="center" overflow="hidden" w="100%" mb={ 3 }>
        <BatchEntityL2
          isLoading={ isLoading }
          number={ number }
          tailLength={ 2 }
          fontSize="xl"
          lineHeight={ 7 }
          fontWeight={ 500 }
          mr="auto"
        />
        <TimeAgoWithTooltip
          timestamp={ timestamp }
          enableIncrement={ !isLoading }
          isLoading={ isLoading }
          color="text_secondary"
          fontWeight={ 400 }
          display="inline-block"
          fontSize="sm"
          flexShrink={ 0 }
          ml={ 2 }
        />
      </Flex>
      <Flex alignItems="center" justifyContent="space-between" w="100%" flexWrap="wrap">
        <Flex alignItems="center">
          <Skeleton isLoaded={ !isLoading } mr={ 2 }>Txn</Skeleton>
          <LinkInternal
            href={ route({ pathname: '/batches/[number]', query: { number: number.toString(), tab: 'txs' } }) }
            isLoading={ isLoading }
          >
            <Skeleton isLoaded={ !isLoading }>
              { txCount }
            </Skeleton>
          </LinkInternal>
        </Flex>
        { status }
      </Flex>
    </Box>
  );
};

export default LatestBatchItem;
