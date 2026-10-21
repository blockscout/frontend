// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra, Text } from '@chakra-ui/react';
import { upperFirst } from 'es-toolkit';
import React from 'react';

import getChainUtilizationParams from 'src/slices/chain/get-chain-utilization-params';
import useStatsQuery from 'src/slices/chain/stats/useStatsQuery';

import SpriteIcon from 'src/sprite/SpriteIcon';

import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { Tooltip } from 'src/toolkit/chakra/tooltip';
import { nbsp } from 'src/toolkit/utils/htmlEntities';

interface Props {
  className?: string;
  label?: string;
}

const ChainUtilization = ({ className, label }: Props) => {
  const statsQuery = useStatsQuery();
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
      columnGap={ 1 }
      textStyle="sm"
    >
      { label ? <Text as="span">{ label }{ nbsp }</Text> : <SpriteIcon name="utilization" boxSize={ 5 } color={ color }/> }
      <Tooltip content={ `Network utilization: ${ upperFirst(load) } load` }>
        <Text as="span" color={ color } fontWeight={ 700 }>
          { value.toFixed(2) }%
        </Text>
      </Tooltip>
    </Skeleton>
  );
};

export default chakra(ChainUtilization);
