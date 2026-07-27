// SPDX-License-Identifier: LicenseRef-Blockscout

import { useRouter } from 'next/router';
import React from 'react';

import ActionBar from 'src/shell/page/action-bar/ActionBar';

import useAddressQuery from 'src/slices/address/hooks/useAddressQuery';
import LogItem from 'src/slices/log/components/LogItem';
import { LOG } from 'src/slices/log/stubs/log';

import CsvExport from 'src/features/csv-export/components/CsvExport';

import useIsMounted from 'src/shared/hooks/useIsMounted';
import DataList from 'src/shared/lists/DataList';
import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';
import Pagination from 'src/shared/pagination/Pagination';
import useQueryWithPages from 'src/shared/pagination/useQueryWithPages';
import { generateListStub } from 'src/shared/pagination/utils';
import getQueryParamString from 'src/shared/router/get-query-param-string';

// log rows are tall, so the initial window is smaller than the default
const INITIAL_RENDERED_ITEMS_NUM = 10;

type Props = {
  shouldRender?: boolean;
  isQueryEnabled?: boolean;
};

const AddressLogs = ({ shouldRender = true, isQueryEnabled = true }: Props) => {
  const router = useRouter();
  const isMounted = useIsMounted();

  const hash = getQueryParamString(router.query.hash);
  const { data, isPlaceholderData, isError, pagination, queryHash } = useQueryWithPages({
    resourceName: 'core:address_logs',
    pathParams: { hash },
    options: {
      enabled: isQueryEnabled,
      placeholderData: generateListStub<'core:address_logs'>(LOG, 3, { next_page_params: {
        block_number: 9005750,
        index: 42,
        items_count: 50,
        transaction_index: 23,
      } }),
    },
  });

  const { cutRef, renderedItemsNum } = useLazyRenderedList({
    list: data?.items,
    isEnabled: !isPlaceholderData,
    minItemsNum: INITIAL_RENDERED_ITEMS_NUM,
    resetKey: queryHash,
  });

  const addressQuery = useAddressQuery({ hash });

  const actionBar = (
    <ActionBar mt={ -6 } showShadow justifyContent={{ base: 'space-between', lg: 'end' }}>
      <CsvExport
        type="address_logs"
        resourceName="core:address_csv_export_logs"
        pathParams={{ hash }}
        loadingInitial={ pagination.isLoading }
      />
      <Pagination ml="auto" { ...pagination }/>
    </ActionBar>
  );

  if (!isMounted || !shouldRender) {
    return null;
  }

  const renderedLogs = data?.items?.slice(0, renderedItemsNum).map((item, index) => (
    <LogItem
      key={ index }
      data={ item }
      type="address"
      isLoading={ isPlaceholderData }
      defaultDataType={ addressQuery.data?.zilliqa?.is_scilla_contract ? 'UTF-8' : undefined }
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
      actionBar={ actionBar }
    >
      { content }
    </DataList>
  );
};

export default AddressLogs;
