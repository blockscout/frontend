// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import config from 'client/config';
import React from 'react';

import PageTitle from 'client/shell/page/title/PageTitle';

import useEtherscanRedirects from 'client/shared/router/useEtherscanRedirects';

import useChainStats from '../../hooks/useChainStats';
import ChainStatsCounters from './ChainStatsCounters';
import ChainStatsFilters from './ChainStatsFilters';
import ChainStatsSections from './ChainStatsSections';

const ChainStatsIndex = () => {
  useEtherscanRedirects();

  const {
    isLoading,
    isError,
    sections,
    displayedSections,
    sectionId,
    initialFilterQuery,
    interval,
    onSectionChange,
    onIntervalChange,
    onFilterChange,
  } = useChainStats();

  return (
    <>
      <PageTitle
        title={ config.meta.seo.enhancedDataEnabled ? `${ config.chain.name } statistic & data` : `${ config.chain.name } stats` }
      />

      <Box mb={{ base: 6, lg: 8 }}>
        <ChainStatsCounters/>
      </Box>

      <Box mb={{ base: 6, lg: 8 }}>
        <ChainStatsFilters
          isLoading={ isLoading }
          initialFilterValue={ initialFilterQuery }
          sections={ sections }
          sectionId={ sectionId }
          onSectionChange={ onSectionChange }
          interval={ interval }
          onIntervalChange={ onIntervalChange }
          onFilterChange={ onFilterChange }
        />
      </Box>

      <ChainStatsSections
        sections={ sections }
        displayedSections={ displayedSections }
        isError={ isError }
        isLoading={ isLoading }
        interval={ interval }
        initialFilterQuery={ initialFilterQuery }
        sectionId={ sectionId }
      />
    </>
  );
};

export default React.memo(ChainStatsIndex);
