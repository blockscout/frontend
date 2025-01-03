import type { TagProps } from '@chakra-ui/react';
import React from 'react';

import type { StatsInterval, StatsIntervalIds } from 'types/client/stats';
import type { SelectOption } from 'ui/shared/select/types';

import Skeleton from 'ui/shared/chakra/Skeleton';
import Select from 'ui/shared/select/Select';
import TagGroupSelect from 'ui/shared/tagGroupSelect/TagGroupSelect';
import { STATS_INTERVALS } from 'ui/stats/constants';

const intervalList = Object.keys(STATS_INTERVALS).map((id: string) => ({
  value: id,
  label: STATS_INTERVALS[id as StatsIntervalIds].title,
})) as Array<SelectOption>;

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
      <Select
        options={ intervalList }
        defaultValue={ interval }
        onChange={ onIntervalChange }
        isLoading={ isLoading }
        w={{ base: '100%', lg: '136px' }}
        display={{ base: 'flex', lg: 'none' }}
        flexShrink={ 0 }
        fontWeight={ 600 }
      />
    </>
  );
};

export default React.memo(ChartIntervalSelect);
