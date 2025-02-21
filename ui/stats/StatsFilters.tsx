import { createListCollection, Grid, GridItem } from '@chakra-ui/react';
import React from 'react';

import type * as stats from '@blockscout/stats-types';
import type { StatsIntervalIds } from 'types/client/stats';

import { SelectContent, SelectControl, SelectItem, SelectRoot, SelectValueText } from 'toolkit/chakra/select';
import ChartIntervalSelect from 'ui/shared/chart/ChartIntervalSelect';
import FilterInput from 'ui/shared/filters/FilterInput';

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

  const collection = React.useMemo(() => {
    return createListCollection({
      items: [
        { value: 'all', label: 'All stats' },
        ...(sections || []).map((section) => ({ value: section.id, label: section.title })),
      ],
    });
  }, [ sections ]);

  const handleItemSelect = React.useCallback(({ value }: { value: Array<string> }) => {
    onSectionChange(value[0]);
  }, [ onSectionChange ]);

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
        <SelectRoot
          collection={ collection }
          variant="outline"
          defaultValue={ [ currentSection ] }
          onValueChange={ handleItemSelect }
          w={{ base: '100%', lg: '136px' }}
        >
          <SelectControl loading={ isLoading }>
            <SelectValueText placeholder="Select section"/>
          </SelectControl>
          <SelectContent>
            { collection.items.map((item) => (
              <SelectItem item={ item } key={ item.value }>
                { item.label }
              </SelectItem>
            )) }
          </SelectContent>
        </SelectRoot>
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
          loading={ isLoading }
          onChange={ onFilterInputChange }
          placeholder="Find chart, metric..."
          initialValue={ initialFilterValue }
          size="sm"
        />
      </GridItem>
    </Grid>
  );
};

export default StatsFilters;
