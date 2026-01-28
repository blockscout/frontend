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

const OpSuperchainAddressPortfolioErc20 = () => {
  const router = useRouter();

  const hash = getQueryParamString(router.query.hash);

  const chainId = [ 'all' ];

  const addressQuery = useApiQuery('multichainAggregator:address', {
    pathParams: { hash },
    queryOptions: {
      placeholderData: ADDRESS,
      refetchOnMount: false,
    },
  });

  const tokensQuery = useQueryWithPages({
    resourceName: 'multichainAggregator:address_tokens',
    pathParams: { hash },
    filters: chainId?.length ? { type: 'ERC-20,NATIVE', chain_id: chainId.includes('all') ? undefined : chainId.filter(Boolean) } : { type: 'ERC-20,NATIVE' },
    options: {
      placeholderData: generateListStub<'multichainAggregator:address_tokens'>(TOKEN, 10, { next_page_params: undefined }),
    },
  });

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
      <OpSuperchainAddressPortfolioCards isLoading={ addressQuery.isPlaceholderData }/>
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
