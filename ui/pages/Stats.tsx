import { Box } from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import React from 'react';

import config from 'configs/app';
import PageTitle from 'ui/shared/Page/PageTitle';

import ChartsWidgetsList from '../stats/ChartsWidgetsList';
import NumberWidgetsList from '../stats/NumberWidgetsList';
import StatsFilters from '../stats/StatsFilters';
import useStats from '../stats/useStats';

const Stats = () => {
  const { t } = useTranslation('common');

  const {
    isPlaceholderData,
    isError,
    sections,
    currentSection,
    handleSectionChange,
    interval,
    handleIntervalChange,
    handleFilterChange,
    displayedCharts,
    filterQuery,
  } = useStats();

  displayedCharts?.forEach((displayedChart) => {
    displayedChart.title = t(`stats_chart_group.${ displayedChart.id }_title`);

    displayedChart.charts.forEach((chart) => {
      chart.title = t(`stats_chart.${ chart.id }_title`);
      chart.description = t(`stats_chart.${ chart.id }_description`);
    });
  });

  return (
    <>
      <PageTitle title={ `${ config.chain.name } ${ t('stats') }` }/>

      <Box mb={{ base: 6, sm: 8 }}>
        <NumberWidgetsList/>
      </Box>

      <Box mb={{ base: 6, sm: 8 }}>
        <StatsFilters
          sections={ sections }
          currentSection={ currentSection }
          onSectionChange={ handleSectionChange }
          interval={ interval }
          onIntervalChange={ handleIntervalChange }
          onFilterInputChange={ handleFilterChange }
        />
      </Box>

      <ChartsWidgetsList
        filterQuery={ filterQuery }
        isError={ isError }
        isPlaceholderData={ isPlaceholderData }
        charts={ displayedCharts }
        interval={ interval }
      />
    </>
  );
};

export default Stats;
