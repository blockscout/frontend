import { Box } from '@chakra-ui/react';
import React from 'react';

import useChainStats from 'client/features/chain-stats/hooks/useChainStats';
import ChainStatsCounters from 'client/features/chain-stats/pages/index/ChainStatsCounters';
import ChainStatsFilters from 'client/features/chain-stats/pages/index/ChainStatsFilters';
import ChainStatsSections from 'client/features/chain-stats/pages/index/ChainStatsSections';
import multichainConfig from 'configs/multichain';
import { MultichainProvider } from 'lib/contexts/multichain';
import useRoutedChainSelect from 'lib/multichain/useRoutedChainSelect';
import useEtherscanRedirects from 'lib/router/useEtherscanRedirects';
import PageTitle from 'ui/shared/Page/PageTitle';

import ChainSelect from '../components/ChainSelect';

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
