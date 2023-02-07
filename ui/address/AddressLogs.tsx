import { Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import useQueryWithPages from 'lib/hooks/useQueryWithPages';
import ActionBar from 'ui/shared/ActionBar';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import LogItem from 'ui/shared/logs/LogItem';
import LogSkeleton from 'ui/shared/logs/LogSkeleton';
import Pagination from 'ui/shared/Pagination';

const AddressLogs = ({ scrollRef }: {scrollRef?: React.RefObject<HTMLDivElement>}) => {
  const router = useRouter();

  const addressHash = String(router.query?.id);
  const { data, isLoading, isError, pagination, isPaginationVisible } = useQueryWithPages({
    resourceName: 'address_logs',
    pathParams: { id: addressHash },
    scrollRef,
  });

  if (isError) {
    return <DataFetchAlert/>;
  }

  const bar = isPaginationVisible ? (
    <ActionBar mt={ -6 }>
      <Pagination ml="auto" { ...pagination }/>
    </ActionBar>
  ) : null;

  if (isLoading) {
    return (
      <Box>
        { bar }
        <LogSkeleton/>
        <LogSkeleton/>
      </Box>
    );
  }

  if (data.items.length === 0) {
    return <span>There are no logs for this address.</span>;
  }

  return (
    <>
      { bar }
      { data.items.map((item, index) => <LogItem key={ index } { ...item } type="address"/>) }
    </>
  );
};

export default AddressLogs;
