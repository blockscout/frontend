// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import useChainStats from 'client/features/chain-stats/hooks/useChainStats';
import ChainStatsCounters from 'client/features/chain-stats/pages/index/ChainStatsCounters';
import ChainStatsFilters from 'client/features/chain-stats/pages/index/ChainStatsFilters';
import ChainStatsSections from 'client/features/chain-stats/pages/index/ChainStatsSections';
import ChainSelect from 'client/features/multichain/components/ChainSelect';
import { MultichainProvider } from 'client/features/multichain/contexts/multichain';
import useRoutedChainSelect from 'client/features/multichain/hooks/useRoutedChainSelect';

import useEtherscanRedirects from 'client/shared/router/useEtherscanRedirects';

import multichainConfig from 'configs/multichain';
import PageTitle from 'ui/shared/Page/PageTitle';

const MultichainStats = () => {
  useEtherscanRedirects();

  const chainIds = React.useMemo(() => {
    return multichainConfig()?.chains
      .filter((chain) => chain.app_config.features.stats.isEnabled)
      .map((chain) => chain.id);
  }, []);

  const chainSelect = useRoutedChainSelect({ chainIds });

  const chain = React.useMemo(() => {
    return multichainConfig()?.chains.find((chain) => chain.id === chainSelect.value?.[0]);
  }, [ chainSelect.value ]);

  const {
    isLoading,
    isError,
    sections,
    sectionId,
    interval,
    onSectionChange,
    onIntervalChange,
    onFilterChange,
    displayedSections,
    initialFilterQuery,
  } = useChainStats({ chain });

  return (
    <>
      <PageTitle title="Charts & stats"/>
      <ChainSelect
        value={ chainSelect.value }
        onValueChange={ chainSelect.onValueChange }
        chainIds={ chainIds }
        mode="default"
        mb={ 3 }
      />
      <MultichainProvider chainId={ chainSelect.value?.[0] }>
        <Box mb={{ base: 6, sm: 8 }}>
          <ChainStatsCounters/>
        </Box>

        <Box mb={{ base: 6, sm: 8 }}>
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

      </MultichainProvider>

    </>
  );
};

export default MultichainStats;
