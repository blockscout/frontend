import { Grid, GridItem, Skeleton } from '@chakra-ui/react';
import React from 'react';

import type * as stats from '@blockscout/stats-types';
import type { StatsInterval, StatsIntervalIds } from 'types/client/stats';

import FilterInput from 'ui/shared/filters/FilterInput';

import { STATS_INTERVALS } from './constants';
import StatsDropdownMenu from './StatsDropdownMenu';

const intervalList = Object.keys(STATS_INTERVALS).map((id: string) => ({
  id: id,
  title: STATS_INTERVALS[id as StatsIntervalIds].title,
})) as Array<StatsInterval>;

type Props = {
  sections?: Array<stats.LineChartSection>;
  currentSection: string;
  onSectionChange: (newSection: string) => void;
  interval: StatsIntervalIds;
  onIntervalChange: (newInterval: StatsIntervalIds) => void;
  onFilterInputChange: (q: string) => void;
  isLoading: boolean;
  initialFilterValue: string;
}

const StatsFilters = ({
  sections,
  currentSection,
  onSectionChange,
  interval,
  onIntervalChange,
  onFilterInputChange,
  isLoading,
  initialFilterValue,
}: Props) => {
  const sectionsList = [ {
    id: 'all',
    title: 'All',
  }, ... (sections || []) ];

  return (
    <Grid
      gap={ 2 }
      templateAreas={{
        base: `"section interval"
                "input input"`,
        lg: `"section interval input"`,
      }}
      gridTemplateColumns={{ base: 'repeat(2, minmax(0, 1fr))', lg: 'auto auto 1fr' }}
    >
      <GridItem
        w={{ base: '100%', lg: 'auto' }}
        area="section"
      >
        { isLoading ? <Skeleton w={{ base: '100%', lg: '76px' }} h="40px" borderRadius="base"/> : (
          <StatsDropdownMenu
            items={ sectionsList }
            selectedId={ currentSection }
            onSelect={ onSectionChange }
          />
        ) }
      </GridItem>

      <GridItem
        w={{ base: '100%', lg: 'auto' }}
        area="interval"
      >
        { isLoading ? <Skeleton w={{ base: '100%', lg: '118px' }} h="40px" borderRadius="base"/> : (
          <StatsDropdownMenu
            items={ intervalList }
            selectedId={ interval }
            onSelect={ onIntervalChange }
          />
        ) }
      </GridItem>

      <GridItem
        w="100%"
        area="input"
      >
        <FilterInput
          key={ initialFilterValue }
          isLoading={ isLoading }
          onChange={ onFilterInputChange }
          placeholder="Find chart, metric..."
          initialValue={ initialFilterValue }
        />
      </GridItem>
    </Grid>
  );
};

export default StatsFilters;
