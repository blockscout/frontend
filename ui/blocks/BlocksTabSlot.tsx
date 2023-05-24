import { Flex, Box, Text, Skeleton } from '@chakra-ui/react';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import { nbsp } from 'lib/html-entities';
import { HOMEPAGE_STATS } from 'stubs/stats';
import type { Props as PaginationProps } from 'ui/shared/Pagination';
import Pagination from 'ui/shared/Pagination';

interface Props {
  pagination: PaginationProps;
  isPaginationVisible: boolean;
}

const BlocksTabSlot = ({ pagination, isPaginationVisible }: Props) => {
  const statsQuery = useApiQuery('homepage_stats', {
    queryOptions: {
      placeholderData: HOMEPAGE_STATS,
    },
  });

  return (
    <Flex alignItems="center" columnGap={ 8 } display={{ base: 'none', lg: 'flex' }}>
      { statsQuery.data?.network_utilization_percentage !== undefined && (
        <Box>
          <Text as="span" fontSize="sm">
              Network utilization (last 50 blocks):{ nbsp }
          </Text>
          <Skeleton display="inline-block" fontSize="sm" color="blue.400" fontWeight={ 600 } isLoaded={ !statsQuery.isPlaceholderData }>
            <span>{ statsQuery.data.network_utilization_percentage.toFixed(2) }%</span>
          </Skeleton>
        </Box>
      ) }
      { isPaginationVisible && <Pagination my={ 1 } { ...pagination }/> }
    </Flex>
  );
};

export default BlocksTabSlot;
