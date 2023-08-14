import { Box } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import PageTitle from 'ui/shared/Page/PageTitle';

import ChartsWidgetsList from '../stats/ChartsWidgetsList';
import NumberWidgetsList from '../stats/NumberWidgetsList';
import StatsFilters from '../stats/StatsFilters';
import useStats from '../stats/useStats';

const Stats = () => {
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

  return (
    <>
      <PageTitle title={ `${ config.chain.name } stats` }/>

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
