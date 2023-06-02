import { useRouter } from 'next/router';
import React from 'react';

import useQueryWithPages from 'lib/hooks/useQueryWithPages';
import getQueryParamString from 'lib/router/getQueryParamString';
import { LOG } from 'stubs/log';
import { generateListStub } from 'stubs/utils';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import LogItem from 'ui/shared/logs/LogItem';
import Pagination from 'ui/shared/Pagination';

const AddressLogs = ({ scrollRef }: {scrollRef?: React.RefObject<HTMLDivElement>}) => {
  const router = useRouter();

  const hash = getQueryParamString(router.query.hash);
  const { data, isPlaceholderData, isError, pagination, isPaginationVisible } = useQueryWithPages({
    resourceName: 'address_logs',
    pathParams: { hash },
    scrollRef,
    options: {
      placeholderData: generateListStub<'address_logs'>(LOG, 3, { next_page_params: {
        block_number: 9005750,
        index: 42,
        items_count: 50,
        transaction_index: 23,
      } }),
    },
  });

  const actionBar = isPaginationVisible ? (
    <ActionBar mt={ -6 } showShadow>
      <Pagination ml="auto" { ...pagination }/>
    </ActionBar>
  ) : null;

  const content = data?.items ? data.items.map((item, index) => <LogItem key={ index } { ...item } type="address" isLoading={ isPlaceholderData }/>) : null;

  return (
    <DataListDisplay
      isError={ isError }
      items={ data?.items }
      emptyText="There are no logs for this address."
      content={ content }
      actionBar={ actionBar }
    />
  );
};

export default AddressLogs;
