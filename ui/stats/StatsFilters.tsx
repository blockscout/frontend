import { Grid, GridItem, Skeleton } from '@chakra-ui/react';
import React from 'react';

import type * as stats from '@blockscout/stats-types';
import type { StatsIntervalIds } from 'types/client/stats';

import ChartIntervalSelect from 'ui/shared/chart/ChartIntervalSelect';
import FilterInput from 'ui/shared/filters/FilterInput';

import StatsDropdownMenu from './StatsDropdownMenu';

type Props = {
  sections?: Array<stats.LineChartSection>;
  currentSection: string;
  onSectionChange: (newSection: string) => void;
  interval: StatsIntervalIds;
  onIntervalChange: (newInterval: StatsIntervalIds) => void;
  onFilterInputChange: (q: string) => void;
  isLoading: boolean;
  initialFilterValue: string;
};

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
    title: 'All stats',
  }, ... (sections || []) ];

  return (
    <Grid
      gap={{ base: 2, lg: 6 }}
      templateAreas={{
        base: `"section interval"
                "input input"`,
        lg: `"section interval input"`,
      }}
      gridTemplateColumns={{ base: 'repeat(2, minmax(0, 1fr))', lg: 'auto auto 1fr' }}
      alignItems="center"
    >
      <GridItem
        w={{ base: '100%', lg: 'auto' }}
        area="section"
      >
        { isLoading ? <Skeleton w={{ base: '100%', lg: '103px' }} h="32px" borderRadius="base"/> : (
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
        <ChartIntervalSelect interval={ interval } onIntervalChange={ onIntervalChange } isLoading={ isLoading } selectTagSize="md"/>
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
          size="xs"
        />
      </GridItem>
    </Grid>
  );
};

export default StatsFilters;
