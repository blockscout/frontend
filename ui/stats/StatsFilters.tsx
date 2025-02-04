import { Grid, GridItem } from '@chakra-ui/react';
import React from 'react';

import type * as stats from '@blockscout/stats-types';
import type { StatsIntervalIds } from 'types/client/stats';

import ChartIntervalSelect from 'ui/shared/chart/ChartIntervalSelect';
import FilterInput from 'ui/shared/filters/FilterInput';
import Select from 'ui/shared/select/Select';

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

  const options = React.useMemo(() => {
    return [
      { value: 'all', label: 'All stats' },
      ...(sections || []).map((section) => ({ value: section.id, label: section.title })),
    ];
  }, [ sections ]);

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
        <Select
          options={ options }
          defaultValue={ currentSection }
          onChange={ onSectionChange }
          isLoading={ isLoading }
          w={{ base: '100%', lg: '136px' }}
          fontWeight={ 600 }
        />
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
