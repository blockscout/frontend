// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex, Box, Text } from '@chakra-ui/react';
import { upperFirst } from 'es-toolkit';
import { route } from 'nextjs-routes';
import React from 'react';

import type { PaginationParams } from 'src/shared/pagination/types';

import getChainUtilizationParams from 'src/slices/chain/get-chain-utilization-params';
import useStatsQuery from 'src/slices/chain/stats/useStatsQuery';

import Pagination from 'src/shared/pagination/Pagination';
import SpriteIcon from 'src/sprite/SpriteIcon';

import { Link } from 'src/toolkit/chakra/link';
import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { Tooltip } from 'src/toolkit/chakra/tooltip';
import { nbsp } from 'src/toolkit/utils/htmlEntities';

interface Props {
  pagination: PaginationParams | null;
}

const BlocksTabSlot = ({ pagination }: Props) => {
  const statsQuery = useStatsQuery();

  const networkUtilization = getChainUtilizationParams(statsQuery.data?.network_utilization_percentage ?? 0);

  return (
    <Flex alignItems="center" columnGap={ 8 } display={{ base: 'none', lg: 'flex' }}>
      { typeof statsQuery.data?.network_utilization_percentage === 'number' && (
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
