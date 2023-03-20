import { useRouter } from 'next/router';
import React from 'react';

import useQueryWithPages from 'lib/hooks/useQueryWithPages';
import getQueryParamString from 'lib/router/getQueryParamString';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import LogItem from 'ui/shared/logs/LogItem';
import LogSkeleton from 'ui/shared/logs/LogSkeleton';
import Pagination from 'ui/shared/Pagination';

const AddressLogs = ({ scrollRef }: {scrollRef?: React.RefObject<HTMLDivElement>}) => {
  const router = useRouter();

  const hash = getQueryParamString(router.query.hash);
  const { data, isLoading, isError, pagination, isPaginationVisible } = useQueryWithPages({
    resourceName: 'address_logs',
    pathParams: { hash },
    scrollRef,
  });

  const actionBar = isPaginationVisible ? (
    <ActionBar mt={ -6 } showShadow>
      <Pagination ml="auto" { ...pagination }/>
    </ActionBar>
  ) : null;

  const content = data?.items ? data.items.map((item, index) => <LogItem key={ index } { ...item } type="address"/>) : null;

  const skeleton = <><LogSkeleton/><LogSkeleton/></>;

  return (
    <DataListDisplay
      isError={ isError }
      isLoading={ isLoading }
      items={ data?.items }
      emptyText="There are no logs for this address."
      content={ content }
      actionBar={ actionBar }
      skeletonProps={{ customSkeleton: skeleton }}
    />
  );
};

export default AddressLogs;
