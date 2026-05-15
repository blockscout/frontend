// SPDX-License-Identifier: LicenseRef-Blockscout

import { useRouter } from 'next/router';
import React from 'react';

import type * as multichain from '@blockscout/multichain-aggregator-types';

import LogItem from 'client/slices/log/components/LogItem';
import { LOG } from 'client/slices/log/stubs/log';

import CsvExport from 'client/features/csv-export/components/CsvExport';

import useIsMobile from 'client/shared/hooks/useIsMobile';
import getQueryParamString from 'client/shared/router/get-query-param-string';

import multichainConfig from 'configs/multichain';
import { MultichainProvider } from 'lib/contexts/multichain';
import { generateListStub } from 'stubs/utils';
import ChainSelect from 'ui/multichain/components/ChainSelect';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';

import getAvailableChainIds from './getAvailableChainIds';

interface Props {
  addressData: multichain.GetAddressResponse | undefined;
  isLoading: boolean;
}

const MultichainAddressLogs = ({ addressData, isLoading }: Props) => {
  const router = useRouter();
  const chainIds = React.useMemo(() => getAvailableChainIds(addressData), [ addressData ]);
  const isMobile = useIsMobile();

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
      enabled: !isLoading,
    },
    isMultichain: true,
    chainIds,
  });

  const chainData = React.useMemo(() => {
    const config = multichainConfig();
    return config?.chains.find(({ id }) => id === chainValue?.[0]);
  }, [ chainValue ]);

  const actionBar = (
    <ActionBar mt={ -6 }>
      <ChainSelect
        value={ chainValue }
        onValueChange={ onChainValueChange }
        chainIds={ chainIds }
        loading={ isLoading }
        mode={ isMobile ? 'compact' : 'default' }
      />
      { (data?.items.length ?? 0) > 0 && (
        <CsvExport
          type="address_logs"
          resourceName="general:address_csv_export_logs"
          pathParams={{ hash }}
          loadingInitial={ pagination.isLoading }
          chainData={ chainData }
          ml={ 2 }
        />
      ) }
      <Pagination ml="auto" { ...pagination }/>
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
      showActionBarIfError
      actionBar={ actionBar }
    >
      <MultichainProvider chainId={ chainValue?.[0] }>
        { content }
      </MultichainProvider>
    </DataListDisplay>
  );
};

export default MultichainAddressLogs;
