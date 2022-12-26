import { Flex, Box, Text, Skeleton } from '@chakra-ui/react';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import useIsMobile from 'lib/hooks/useIsMobile';
import { nbsp } from 'lib/html-entities';
import type { Props as PaginationProps } from 'ui/shared/Pagination';
import Pagination from 'ui/shared/Pagination';

interface Props {
  pagination: PaginationProps;
  isPaginationVisible: boolean;
}

const BlocksTabSlot = ({ pagination, isPaginationVisible }: Props) => {
  const isMobile = useIsMobile();
  const statsQuery = useApiQuery('homepage_stats');

  if (isMobile) {
    return null;
  }

  return (
    <Flex alignItems="center" columnGap={ 8 }>
      { statsQuery.isLoading && <Skeleton w="175px" h="24px"/> }
      { statsQuery.data?.network_utilization_percentage !== undefined && (
        <Box>
          <Text as="span" fontSize="sm">
              Network utilization (last 50 blocks):{ nbsp }
          </Text>
          <Text as="span" fontSize="sm" color="blue.400" fontWeight={ 600 }>
            { statsQuery.data.network_utilization_percentage.toFixed(2) }%
          </Text>
        </Box>
      ) }
      { isPaginationVisible && <Pagination my={ 1 } { ...pagination }/> }
    </Flex>
  );
};

export default BlocksTabSlot;
