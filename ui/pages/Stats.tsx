import { Box } from '@chakra-ui/react';
import React from 'react';

import Page from 'ui/shared/Page/Page';
import PageTitle from 'ui/shared/Page/PageTitle';

import StatsFilters from '../stats/StatsFilters';
import useStats from '../stats/useStats';
import WidgetsList from '../stats/WidgetsList';

const Stats = () => {
  const {
    section,
    handleSectionChange,
    interval,
    handleIntervalChange,
    debounceFilterCharts,
    displayedCharts,
  } = useStats();

  return (
    <Page>
      <PageTitle text="Ethereum Stats"/>

      <Box mb={{ base: 6, sm: 8 }}>
        <StatsFilters
          section={ section }
          onSectionChange={ handleSectionChange }
          interval={ interval }
          onIntervalChange={ handleIntervalChange }
          onFilterInputChange={ debounceFilterCharts }
        />
      </Box>

      <WidgetsList
        charts={ displayedCharts }
      />
    </Page>
  );
};

export default Stats;
