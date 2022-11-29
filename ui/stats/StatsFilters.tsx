import { Grid, GridItem } from '@chakra-ui/react';
import React from 'react';

import type { StatsInterval, StatsIntervalIds, StatsSection, StatsSectionIds } from 'types/client/stats';

import FilterInput from 'ui/shared/FilterInput';

import { STATS_INTERVALS, STATS_SECTIONS } from './constants';
import StatsDropdownMenu from './StatsDropdownMenu';

const sectionsList = Object.keys(STATS_SECTIONS).map((id: string) => ({
  id: id,
  title: STATS_SECTIONS[id as StatsSectionIds],
})) as Array<StatsSection>;

const intervalList = Object.keys(STATS_INTERVALS).map((id: string) => ({
  id: id,
  title: STATS_INTERVALS[id as StatsIntervalIds],
})) as Array<StatsInterval>;

type Props = {
  section: StatsSectionIds;
  onSectionChange: (newSection: StatsSectionIds) => void;
  interval: StatsIntervalIds;
  onIntervalChange: (newInterval: StatsIntervalIds) => void;
  onFilterInputChange: (q: string) => void;
}

const StatsFilters = ({
  section,
  onSectionChange,
  interval,
  onIntervalChange,
  onFilterInputChange,
}: Props) => {

  return (
    <Grid
      gap={ 2 }
      templateAreas={{
        base: `"input input"
                "section interval"`,
        lg: `"input section interval"`,
      }}
      gridTemplateColumns={{ lg: '1fr auto auto' }}
    >
      <GridItem
        w="100%"
        area="input"
      >
        <FilterInput
          onChange={ onFilterInputChange }
          placeholder="Find chart, metric..."/>
      </GridItem>

      <GridItem
        w={{ base: '100%', lg: 'auto' }}
        area="section"
      >
        <StatsDropdownMenu
          items={ sectionsList }
          selectedId={ section }
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
    </Grid>
  );
};

export default StatsFilters;
