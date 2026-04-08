import { Box, createListCollection } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { CrossChainBridgedTokensSorting, CrossChainBridgedTokensSortingField, CrossChainBridgedTokensSortingValue } from '../../types/api';

import config from 'configs/app';
import useIsMobile from 'lib/hooks/useIsMobile';
import { INTERCHAIN_BRIDGED_TOKEN_ITEM } from 'stubs/interchainIndexer';
import { generateListStub } from 'stubs/utils';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import PageTitle from 'ui/shared/Page/PageTitle';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import getSortParamsFromValue from 'ui/shared/sort/getSortParamsFromValue';
import getSortValueFromQuery from 'ui/shared/sort/getSortValueFromQuery';
import Sort from 'ui/shared/sort/Sort';

import { BRIDGED_TOKENS_SORT_OPTIONS } from '../../utils/bridged-tokens-sort';
import BridgedTokensListItem from './BridgedTokensListItem';
import BridgedTokensTable from './BridgedTokensTable';

const sortCollection = createListCollection({
  items: BRIDGED_TOKENS_SORT_OPTIONS,
});

const BridgedTokens = () => {
  const router = useRouter();
  const isMobile = useIsMobile();

  const [ sort, setSort ] = React.useState<CrossChainBridgedTokensSortingValue>(
    getSortValueFromQuery<CrossChainBridgedTokensSortingValue>(router.query, BRIDGED_TOKENS_SORT_OPTIONS) ?? 'default',
  );

  const { data, isPlaceholderData, isError, onSortingChange, pagination } = useQueryWithPages({
    resourceName: 'interchainIndexer:bridged_tokens',
    pathParams: {
      chainId: config.chain.id,
    },
    sorting: getSortParamsFromValue<CrossChainBridgedTokensSortingValue, CrossChainBridgedTokensSortingField, CrossChainBridgedTokensSorting['order']>(sort),
    options: {
      placeholderData: generateListStub<'interchainIndexer:bridged_tokens'>(INTERCHAIN_BRIDGED_TOKEN_ITEM, 10, { next_page_params: { page_token: 'token' } }),
    },
  });

  const handleSortChange = React.useCallback(({ value }: { value: Array<string> }) => {
    setSort(value[0] as CrossChainBridgedTokensSortingValue);
    onSortingChange(value[0] === 'default' ? undefined : getSortParamsFromValue(value[0] as CrossChainBridgedTokensSortingValue));
  }, [ onSortingChange ]);

  const actionBar = isMobile || pagination.isVisible ? (
    <ActionBar>
      <Sort
        name="bridged_tokens_sorting"
        defaultValue={ [ sort ] }
        collection={ sortCollection }
        onValueChange={ handleSortChange }
        isLoading={ isPlaceholderData }
        hideFrom="lg"
      />
      <Pagination { ...pagination } ml="auto"/>
    </ActionBar>
  ) : null;

  return (
    <>
      <PageTitle
        title="Bridged tokens"
        withTextAd
      />
      <DataListDisplay
        isError={ isError }
        itemsNum={ data?.items.length }
        emptyText="There are no bridged tokens."
        emptyStateProps={{
          term: 'bridged token',
        }}
        actionBar={ actionBar }
      >
        { data?.items ? (
          <>
            <Box hideFrom="lg">
              { data.items.map((item, index) => {
                const tokenCurrentChain = item.tokens.find((token) => String(token.chain_id) === config.chain.id);

                return (
                  <BridgedTokensListItem
                    key={ String(tokenCurrentChain?.token_address) + (isPlaceholderData ? index : '') }
                    data={ item }
                    token={ tokenCurrentChain }
                    index={ index }
                    page={ pagination.page }
                    isLoading={ isPlaceholderData }
                  />
                );
              }) }
            </Box>
            <Box hideBelow="lg">
              <BridgedTokensTable data={ data.items } sort={ sort } setSorting={ handleSortChange } isLoading={ isPlaceholderData } page={ pagination.page }/>
            </Box>
          </>
        ) : null }
      </DataListDisplay>
    </>
  );
};

export default React.memo(BridgedTokens);
