import type { TagProps } from '@chakra-ui/react';
import { Skeleton } from '@chakra-ui/react';
import React from 'react';

import type { StatsInterval, StatsIntervalIds } from 'types/client/stats';

import TagGroupSelect from 'ui/shared/tagGroupSelect/TagGroupSelect';
import { STATS_INTERVALS } from 'ui/stats/constants';
import StatsDropdownMenu from 'ui/stats/StatsDropdownMenu';

const intervalList = Object.keys(STATS_INTERVALS).map((id: string) => ({
  id: id,
  title: STATS_INTERVALS[id as StatsIntervalIds].title,
})) as Array<StatsInterval>;

const intervalListShort = Object.keys(STATS_INTERVALS).map((id: string) => ({
  id: id,
  title: STATS_INTERVALS[id as StatsIntervalIds].shortTitle,
})) as Array<StatsInterval>;

type Props = {
  interval: StatsIntervalIds;
  onIntervalChange: (newInterval: StatsIntervalIds) => void;
  isLoading?: boolean;
  selectTagSize?: TagProps['size'];
};

const ChartIntervalSelect = ({ interval, onIntervalChange, isLoading, selectTagSize }: Props) => {
  return (
    <>
      <Skeleton display={{ base: 'none', lg: 'flex' }} borderRadius="base" isLoaded={ !isLoading }>
        <TagGroupSelect<StatsIntervalIds> items={ intervalListShort } onChange={ onIntervalChange } value={ interval } tagSize={ selectTagSize }/>
      </Skeleton>
      <Skeleton display={{ base: 'block', lg: 'none' }} borderRadius="base" isLoaded={ !isLoading }>
        <StatsDropdownMenu
          items={ intervalList }
          selectedId={ interval }
          onSelect={ onIntervalChange }
        />
      </Skeleton>
    </>
  );
};

export default React.memo(ChartIntervalSelect);
