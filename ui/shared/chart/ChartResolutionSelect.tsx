import { Skeleton } from '@chakra-ui/react';
import React from 'react';

import type { Resolution } from '@blockscout/stats-types';

import { STATS_RESOLUTIONS } from 'ui/stats/constants';
import StatsDropdownMenu from 'ui/stats/StatsDropdownMenu';

type Props = {
  resolution: Resolution;
  resolutions: Array<string>;
  onResolutionChange: (resolution: Resolution) => void;
  isLoading?: boolean;
};

const ChartResolutionSelect = ({ resolution, resolutions, onResolutionChange, isLoading }: Props) => {
  return (
    <Skeleton borderRadius="base" isLoaded={ !isLoading } w={{ base: 'auto', lg: '160px' }}>
      <StatsDropdownMenu
        items={ STATS_RESOLUTIONS.filter(r => resolutions.includes(r.id)) }
        selectedId={ resolution }
        onSelect={ onResolutionChange }
      />
    </Skeleton>
  );
};

export default React.memo(ChartResolutionSelect);
