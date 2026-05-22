// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex, Box, Text } from '@chakra-ui/react';
import { upperFirst } from 'es-toolkit';
import React from 'react';

import type { PaginationParams } from 'client/shared/pagination/types';

import { route } from 'nextjs-routes';

import useApiQuery from 'client/api/hooks/useApiQuery';

import getChainUtilizationParams from 'client/slices/chain/get-chain-utilization-params';
import { HOMEPAGE_STATS } from 'client/slices/home/stubs';

import Pagination from 'client/shared/pagination/Pagination';
import SpriteIcon from 'client/sprite/SpriteIcon';

import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tooltip } from 'toolkit/chakra/tooltip';
import { nbsp } from 'toolkit/utils/htmlEntities';

interface Props {
  pagination: PaginationParams | null;
}

const BlocksTabSlot = ({ pagination }: Props) => {
  const statsQuery = useApiQuery('general:stats', {
    queryOptions: {
      placeholderData: HOMEPAGE_STATS,
    },
  });

  const networkUtilization = getChainUtilizationParams(statsQuery.data?.network_utilization_percentage ?? 0);

  return (
    <Flex alignItems="center" columnGap={ 8 } display={{ base: 'none', lg: 'flex' }}>
      { statsQuery.data?.network_utilization_percentage !== undefined && (
        <Box>
          <Text as="span" fontSize="sm">
            Network utilization (last 50 blocks):{ nbsp }
          </Text>
          <Tooltip content={ `${ upperFirst(networkUtilization.load) } load` }>
            <Skeleton display="inline-block" fontSize="sm" color={ networkUtilization.color } fontWeight={ 600 } loading={ statsQuery.isPlaceholderData }>
              <span>{ statsQuery.data.network_utilization_percentage.toFixed(2) }%</span>
            </Skeleton>
          </Tooltip>
        </Box>
      ) }
      <Link href={ route({ pathname: '/block/countdown' }) }>
        <SpriteIcon name="hourglass" boxSize={ 5 } mr={ 2 }/>
        <span>Block countdown</span>
      </Link>
      { pagination && <Pagination my={ 1 } { ...pagination }/> }
    </Flex>
  );
};

export default BlocksTabSlot;
