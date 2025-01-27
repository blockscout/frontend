import { Box, Flex } from '@chakra-ui/react';
import React from 'react';

import { route } from 'nextjs-routes';

import { Skeleton } from 'toolkit/chakra/skeleton';
import BatchEntityL2 from 'ui/shared/entities/block/BatchEntityL2';
import LinkInternal from 'ui/shared/links/LinkInternal';
import TimeAgoWithTooltip from 'ui/shared/TimeAgoWithTooltip';

type Props = {
  number: number;
  timestamp: string | null;
  txCount: number;
  status?: React.ReactNode;
  isLoading: boolean;
  animation?: string;
};

const LatestBatchItem = ({ number, timestamp, txCount, status, isLoading, animation }: Props) => {
  return (
    <Box
      animation={ animation }
      borderRadius="md"
      border="1px solid"
      borderColor="border.divider"
      p={ 3 }
    >
      <Flex alignItems="center" overflow="hidden" w="100%" mb={ 3 }>
        <BatchEntityL2
          isLoading={ isLoading }
          number={ number }
          tailLength={ 2 }
          textStyle="xl"
          fontWeight={ 500 }
          mr="auto"
        />
        <TimeAgoWithTooltip
          timestamp={ timestamp }
          enableIncrement={ !isLoading }
          isLoading={ isLoading }
          color="text.secondary"
          display="inline-block"
          textStyle="sm"
          flexShrink={ 0 }
          ml={ 2 }
        />
      </Flex>
      <Flex alignItems="center" justifyContent="space-between" w="100%" flexWrap="wrap">
        <Flex alignItems="center">
          <Skeleton loading={ isLoading } mr={ 2 }>Txn</Skeleton>
          <LinkInternal
            href={ route({ pathname: '/batches/[number]', query: { number: number.toString(), tab: 'txs' } }) }
            isLoading={ isLoading }
          >
            <Skeleton loading={ isLoading }>
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
