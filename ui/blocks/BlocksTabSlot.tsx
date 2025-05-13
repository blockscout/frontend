import { Flex, Box, Text } from '@chakra-ui/react';
import React from 'react';

import type { PaginationParams } from 'ui/shared/pagination/types';

import { route } from 'nextjs-routes';

import useApiQuery from 'lib/api/useApiQuery';
import { HOMEPAGE_STATS } from 'stubs/stats';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { nbsp } from 'toolkit/utils/htmlEntities';
import IconSvg from 'ui/shared/IconSvg';
import Pagination from 'ui/shared/pagination/Pagination';

interface Props {
  pagination: PaginationParams;
}

const BlocksTabSlot = ({ pagination }: Props) => {
  const statsQuery = useApiQuery('general:stats', {
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
          <Skeleton display="inline-block" fontSize="sm" color="blue.400" fontWeight={ 600 } loading={ statsQuery.isPlaceholderData }>
            <span>{ statsQuery.data.network_utilization_percentage.toFixed(2) }%</span>
          </Skeleton>
        </Box>
      ) }
      <Link href={ route({ pathname: '/block/countdown' }) }>
        <IconSvg name="hourglass" boxSize={ 5 } mr={ 2 }/>
        <span>Block countdown</span>
      </Link>
      <Pagination my={ 1 } { ...pagination }/>
    </Flex>
  );
};

export default BlocksTabSlot;
