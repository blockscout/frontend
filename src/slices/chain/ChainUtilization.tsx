// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra, HStack, Text } from '@chakra-ui/react';
import { upperFirst } from 'es-toolkit';
import React from 'react';

import type { ClusterChainConfig } from 'src/features/multichain/types/client';

import getChainUtilizationParams from 'src/slices/chain/get-chain-utilization-params';
import useStatsQuery from 'src/slices/chain/stats/useStatsQuery';

import SpriteIcon from 'src/sprite/SpriteIcon';

import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { Tooltip } from 'src/toolkit/chakra/tooltip';
import { nbsp } from 'src/toolkit/utils/htmlEntities';

interface Props {
  className?: string;
  label?: string;
  chain?: ClusterChainConfig;
}

const ChainUtilization = ({ className, label, chain }: Props) => {
  const statsQuery = useStatsQuery({ chain });
  const value = statsQuery.data?.network_utilization_percentage;

  if (typeof value !== 'number') {
    return null;
  }

  const { load, color } = getChainUtilizationParams(value);

  return (
    <Skeleton
      className={ className }
      loading={ statsQuery.isPlaceholderData }
      display="inline-flex"
      alignItems="center"
      textStyle="sm"
    >
      { label && <Text as="span">{ label }{ nbsp }</Text> }
      <Tooltip content={ `Network utilization: ${ upperFirst(load) } load` }>
        <HStack gap={ 1 }>
          { !label && <SpriteIcon name="utilization" boxSize={ 5 } color={ color }/> }
          <Text as="span" color={ color } fontWeight="bold">
            { value.toFixed(2) }%
          </Text>
        </HStack>
      </Tooltip>
    </Skeleton>
  );
};

export default chakra(ChainUtilization);
