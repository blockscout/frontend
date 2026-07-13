// SPDX-License-Identifier: LicenseRef-Blockscout

import { useRouter } from 'next/router';
import React from 'react';

import type * as multichain from '@blockscout/multichain-aggregator-types';

import ActionBar from 'src/shell/page/action-bar/ActionBar';

import LogItem from 'src/slices/log/components/LogItem';
import { LOG } from 'src/slices/log/stubs/log';

import CsvExport from 'src/features/csv-export/components/CsvExport';
import multichainConfig from 'src/features/multichain/chains-config';
import ChainSelect from 'src/features/multichain/components/ChainSelect';
import { MultichainProvider } from 'src/features/multichain/context';

import useIsMobile from 'src/shared/hooks/useIsMobile';
import DataList from 'src/shared/lists/DataList';
import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';
import Pagination from 'src/shared/pagination/Pagination';
import useQueryWithPages from 'src/shared/pagination/useQueryWithPages';
import { generateListStub } from 'src/shared/pagination/utils';
import getQueryParamString from 'src/shared/router/get-query-param-string';

import getAvailableChainIds from './get-available-chain-ids';

// log rows are tall, so the initial window is smaller than the default
const INITIAL_RENDERED_ITEMS_NUM = 10;

interface Props {
  addressData: multichain.GetAddressResponse | undefined;
  isLoading: boolean;
}

const MultichainAddressLogs = ({ addressData, isLoading }: Props) => {
  const router = useRouter();
  const chainIds = React.useMemo(() => getAvailableChainIds(addressData), [ addressData ]);
  const isMobile = useIsMobile();

  const hash = getQueryParamString(router.query.hash);
  const { data, isPlaceholderData, isError, pagination, chainValue, onChainValueChange, queryHash } = useQueryWithPages({
    resourceName: 'core:address_logs',
    pathParams: { hash },
    options: {
      placeholderData: generateListStub<'core:address_logs'>(LOG, 3, { next_page_params: {
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

  const { cutRef, renderedItemsNum } = useLazyRenderedList({
    list: data?.items,
    isEnabled: !isPlaceholderData,
    minItemsNum: INITIAL_RENDERED_ITEMS_NUM,
    resetKey: queryHash,
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
          resourceName="core:address_csv_export_logs"
          pathParams={{ hash }}
          loadingInitial={ pagination.isLoading }
          chainData={ chainData }
          ml={ 2 }
        />
      ) }
      <Pagination ml="auto" { ...pagination }/>
    </ActionBar>
  );

  const renderedLogs = data?.items?.slice(0, renderedItemsNum).map((item, index) => (
    <LogItem
      key={ index }
      data={ item }
      type="address"
      isLoading={ isPlaceholderData }
      chainData={ chainData }
    />
  ));

  const content = renderedLogs ? (
    <>
      { renderedLogs }
      <div ref={ cutRef }/>
    </>
  ) : null;

  return (
    <DataList
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
    </DataList>
  );
};

export default MultichainAddressLogs;
