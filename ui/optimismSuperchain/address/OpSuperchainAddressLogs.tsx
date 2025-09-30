import { useRouter } from 'next/router';
import React from 'react';

import multichainConfig from 'configs/multichain';
import { MultichainProvider } from 'lib/contexts/multichain';
import getQueryParamString from 'lib/router/getQueryParamString';
import { LOG } from 'stubs/log';
import { generateListStub } from 'stubs/utils';
import AddressCsvExportLink from 'ui/address/AddressCsvExportLink';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import LogItem from 'ui/shared/logs/LogItem';
import ChainSelect from 'ui/shared/multichain/ChainSelect';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';

const OpSuperchainAddressLogs = () => {
  const router = useRouter();

  const hash = getQueryParamString(router.query.hash);
  const { data, isPlaceholderData, isError, pagination, chainValue, onChainValueChange } = useQueryWithPages({
    resourceName: 'general:address_logs',
    pathParams: { hash },
    options: {
      placeholderData: generateListStub<'general:address_logs'>(LOG, 3, { next_page_params: {
        block_number: 9005750,
        index: 42,
        items_count: 50,
        transaction_index: 23,
      } }),
    },
    isMultichain: true,
  });

  const chainData = multichainConfig()?.chains.find(chain => chain.slug === chainValue?.[0]);

  const actionBar = (
    <ActionBar mt={ -6 } showShadow>
      <ChainSelect
        value={ chainValue }
        onValueChange={ onChainValueChange }
      />
      <AddressCsvExportLink
        address={ hash }
        isLoading={ pagination.isLoading }
        params={{ type: 'logs' }}
        ml={{ base: 2, lg: 'auto' }}
      />
      <Pagination ml={{ base: 'auto', lg: 8 }} { ...pagination }/>
    </ActionBar>
  );

  const content = data?.items ? data.items.map((item, index) => (
    <LogItem
      key={ index }
      { ...item }
      type="address"
      isLoading={ isPlaceholderData }
      chainData={ chainData }
    />
  )) : null;

  return (
    <DataListDisplay
      isError={ isError }
      itemsNum={ data?.items?.length }
      emptyText="There are no logs for this address."
      showActionBarIfEmpty
      actionBar={ actionBar }
    >
      <MultichainProvider chainSlug={ chainValue?.[0] }>
        { content }
      </MultichainProvider>
    </DataListDisplay>
  );
};

export default OpSuperchainAddressLogs;
