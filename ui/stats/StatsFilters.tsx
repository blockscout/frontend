import { Grid, GridItem } from '@chakra-ui/react';
import debounce from 'lodash/debounce';
import React, { useCallback, useState } from 'react';

import type { StatsInterval, StatsIntervalIds, StatsSection, StatsSectionIds } from 'types/client/stats';

import FilterInput from 'ui/shared/FilterInput';

import { STATS_INTERVALS, STATS_SECTIONS } from './constants';
import StatsDropdownMenu from './StatsDropdownMenu';

const sectionsList = Object.keys(STATS_SECTIONS).map((id: string) => ({
  id: id,
  value: STATS_SECTIONS[id as StatsSectionIds],
})) as Array<StatsSection>;

const intervalList = Object.keys(STATS_INTERVALS).map((id: string) => ({
  id: id,
  value: STATS_INTERVALS[id as StatsIntervalIds],
})) as Array<StatsInterval>;

const StatsFilters = () => {
  const [ selectedSectionId, setSelectedSectionId ] = useState<StatsSectionIds>('all');
  const [ selectedIntervalId, setSelectedIntervalId ] = useState<StatsIntervalIds>('all');
  const [ , setFilterQuery ] = useState('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceFilterCharts = useCallback(debounce(q => setFilterQuery(q), 500), []);

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
          onChange={ debounceFilterCharts }
          placeholder="Find chart, metric..."/>
      </GridItem>

      <GridItem
        w={{ base: '100%', lg: 'auto' }}
        area="section"
      >
        <StatsDropdownMenu
          items={ sectionsList }
          selectedId={ selectedSectionId }
          onSelect={ setSelectedSectionId }
        />
      </GridItem>

      <GridItem
        w={{ base: '100%', lg: 'auto' }}
        area="interval"
      >
        <StatsDropdownMenu
          items={ intervalList }
          selectedId={ selectedIntervalId }
          onSelect={ setSelectedIntervalId }
        />
      </GridItem>
    </Grid>
  );
};

export default StatsFilters;
