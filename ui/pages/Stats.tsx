import { Box } from '@chakra-ui/react';
import React from 'react';

import appConfig from 'configs/app/config';
import Page from 'ui/shared/Page/Page';
import PageTitle from 'ui/shared/Page/PageTitle';

import ChartsWidgetsList from '../stats/ChartsWidgetsList';
import NumberWidgetsList from '../stats/NumberWidgetsList';
import StatsFilters from '../stats/StatsFilters';
import useStats from '../stats/useStats';

const Stats = () => {
  const {
    section,
    handleSectionChange,
    interval,
    handleIntervalChange,
    debounceFilterCharts,
    displayedCharts,
    showChartFullscreen,
    clearFullscreenChart,
    fullscreenChart,
  } = useStats();

  return (
    <Page>
      <PageTitle text={ `${ appConfig.network.name } Stats` }/>

      <Box mb={{ base: 6, sm: 8 }}>
        <NumberWidgetsList/>
      </Box>

      <Box mb={{ base: 6, sm: 8 }}>
        <StatsFilters
          section={ section }
          onSectionChange={ handleSectionChange }
          interval={ interval }
          onIntervalChange={ handleIntervalChange }
          onFilterInputChange={ debounceFilterCharts }
        />
      </Box>

      <ChartsWidgetsList
        charts={ displayedCharts }
        onChartFullscreenClick={ showChartFullscreen }
        fullscreenChart={ fullscreenChart }
        onModalClose={ clearFullscreenChart }
      />
    </Page>
  );
};

export default Stats;
