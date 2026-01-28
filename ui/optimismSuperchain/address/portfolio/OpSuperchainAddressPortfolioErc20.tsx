import { Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import getQueryParamString from 'lib/router/getQueryParamString';
import { ADDRESS, TOKEN } from 'stubs/optimismSuperchain';
import { generateListStub } from 'stubs/utils';
import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';

import OpSuperchainAddressPortfolioCards from './OpSuperchainAddressPortfolioCards';
import OpSuperchainAddressPortfolioNetWorth from './OpSuperchainAddressPortfolioNetWorth';
import OpSuperchainAddressTokensListItem from './OpSuperchainAddressTokensListItem';
import OpSuperchainAddressTokensTable from './OpSuperchainAddressTokensTable';

const TYPE_FILTER_VALUE = 'ERC-20,NATIVE';

const OpSuperchainAddressPortfolioErc20 = () => {
  const router = useRouter();

  const hash = getQueryParamString(router.query.hash);
  const chainIdParam = getQueryParamString(router.query.chain_id);

  const addressQuery = useApiQuery('multichainAggregator:address', {
    pathParams: { hash },
    queryOptions: {
      placeholderData: ADDRESS,
      refetchOnMount: false,
    },
  });

  const availableChainIds = React.useMemo(() => {
    if (addressQuery.isPlaceholderData) {
      return [];
    }
    return addressQuery.data?.chain_infos ? Object.keys(addressQuery.data.chain_infos) : [];
  }, [ addressQuery.data?.chain_infos, addressQuery.isPlaceholderData ]);

  const [ chainIds, setChainIds ] = React.useState<Array<string>>([]);

  const isAllChains = chainIds.length === availableChainIds.length;

  React.useEffect(() => {
    if (!addressQuery.isPlaceholderData) {
      const chainIds = chainIdParam ? chainIdParam.split(',').filter((chainId) => availableChainIds.includes(chainId)) : [];
      setChainIds(chainIds);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ addressQuery.isPlaceholderData ]);

  const tokensQuery = useQueryWithPages({
    resourceName: 'multichainAggregator:address_tokens',
    pathParams: { hash },
    filters: {
      type: TYPE_FILTER_VALUE,
      chain_id: isAllChains ? undefined : chainIds,
    },
    options: {
      enabled: !addressQuery.isPlaceholderData,
      placeholderData: generateListStub<'multichainAggregator:address_tokens'>(TOKEN, 10, { next_page_params: undefined }),
    },
  });

  const handleChainIdsChange = React.useCallback((nextValue: Array<string>) => {
    setChainIds(nextValue.length === availableChainIds.length ? [] : nextValue);
    tokensQuery.onFilterChange({
    //   type: TYPE_FILTER_VALUE,
      chain_id: nextValue.length === availableChainIds.length ? undefined : nextValue,
    });
  }, [ availableChainIds.length, tokensQuery ]);

  const tokensContent = tokensQuery.data?.items ? (
    <>
      <Box hideBelow="lg">
        <OpSuperchainAddressTokensTable
          data={ tokensQuery.data.items }
          top={ tokensQuery.pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 64 }
          isLoading={ tokensQuery.isPlaceholderData }
        />
      </Box>
      <Box hideFrom="lg">
        { tokensQuery.data.items.map((item, index) => (
          <OpSuperchainAddressTokensListItem
            key={ item.token.address_hash + (tokensQuery.isPlaceholderData ? index : '') + (item.chain_values ? Object.keys(item.chain_values).join(',') : '') }
            data={ item }
            isLoading={ tokensQuery.isPlaceholderData }
          />
        )) }
      </Box>
    </>
  ) : null;

  const actionBar = tokensQuery.pagination.isVisible && (
    <ActionBar mt={ -6 }>
      <Pagination ml="auto" { ...tokensQuery.pagination }/>
    </ActionBar>
  );

  return (
    <Box>
      <OpSuperchainAddressPortfolioNetWorth/>
      <OpSuperchainAddressPortfolioCards
        chainIds={ availableChainIds }
        value={ chainIds }
        onChange={ handleChainIdsChange }
        isLoading={ addressQuery.isPlaceholderData }
      />
      <DataListDisplay
        isError={ tokensQuery.isError }
        itemsNum={ tokensQuery.data?.items?.length }
        emptyText="There are no tokens at this address."
        actionBar={ actionBar }
      >
        { tokensContent }
      </DataListDisplay>
    </Box>
  );
};

export default React.memo(OpSuperchainAddressPortfolioErc20);
