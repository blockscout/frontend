import { Grid, GridItem } from '@chakra-ui/react';
import React from 'react';

import type { StatsChartsSection } from 'types/api/stats';
import type { StatsInterval, StatsIntervalIds } from 'types/client/stats';

import FilterInput from 'ui/shared/filters/FilterInput';

import { STATS_INTERVALS } from './constants';
import StatsDropdownMenu from './StatsDropdownMenu';

const intervalList = Object.keys(STATS_INTERVALS).map((id: string) => ({
  id: id,
  title: STATS_INTERVALS[id as StatsIntervalIds].title,
})) as Array<StatsInterval>;

type Props = {
  sections?: Array<StatsChartsSection>;
  currentSection: string;
  onSectionChange: (newSection: string) => void;
  interval: StatsIntervalIds;
  onIntervalChange: (newInterval: StatsIntervalIds) => void;
  onFilterInputChange: (q: string) => void;
}

const StatsFilters = ({
  sections,
  currentSection,
  onSectionChange,
  interval,
  onIntervalChange,
  onFilterInputChange,
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
        <StatsDropdownMenu
          items={ sectionsList }
          selectedId={ currentSection }
          onSelect={ onSectionChange }
        />
      </GridItem>

      <GridItem
        w={{ base: '100%', lg: 'auto' }}
        area="interval"
      >
        <StatsDropdownMenu
          items={ intervalList }
          selectedId={ interval }
          onSelect={ onIntervalChange }
        />
      </GridItem>

      <GridItem
        w="100%"
        area="input"
      >
        <FilterInput
          onChange={ onFilterInputChange }
          placeholder="Find chart, metric..."/>
      </GridItem>
    </Grid>
  );
};

export default StatsFilters;
