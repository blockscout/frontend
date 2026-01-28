import { Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import getQueryParamString from 'lib/router/getQueryParamString';
import { ADDRESS, TOKEN } from 'stubs/optimismSuperchain';
import { generateListStub } from 'stubs/utils';
import ERC20Tokens from 'ui/address/tokens/ERC20Tokens';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';

import OpSuperchainAddressPortfolioCards from './OpSuperchainAddressPortfolioCards';
import OpSuperchainAddressPortfolioNetWorth from './OpSuperchainAddressPortfolioNetWorth';

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
    filters: chainId?.length ? { type: 'ERC-20', chain_id: chainId.includes('all') ? undefined : chainId.filter(Boolean) } : { type: 'ERC-20' },
    options: {
      placeholderData: generateListStub<'multichainAggregator:address_tokens'>(TOKEN, 10, { next_page_params: undefined }),
    },
  });

  return (
    <Box>
      <OpSuperchainAddressPortfolioNetWorth/>
      <OpSuperchainAddressPortfolioCards isLoading={ addressQuery.isPlaceholderData }/>
      <ERC20Tokens
        items={ tokensQuery.data?.items }
        isLoading={ tokensQuery.isPlaceholderData }
        pagination={ tokensQuery.pagination }
        isError={ tokensQuery.isError }
        top={ tokensQuery.pagination.isVisible ? 68 : 0 }
      />
    </Box>
  );
};

export default React.memo(OpSuperchainAddressPortfolioErc20);
