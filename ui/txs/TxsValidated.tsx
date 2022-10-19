import { Show, Alert } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type { TransactionsResponse } from 'types/api/transaction';
import { QueryKeys } from 'types/client/queries';

import useFetch from 'lib/hooks/useFetch';
import DataFetchAlert from 'ui/shared/DataFetchAlert';

import TxsContent from './TxsContent';
import TxsSkeletonDesktop from './TxsSkeletonDesktop';
import TxsSkeletonMobile from './TxsSkeletonMobile';

const TxsValidated = () => {
  const fetch = useFetch();
  const { data, isLoading, isError } =
  useQuery<unknown, unknown, TransactionsResponse>([ QueryKeys.transactionsValidated ], async() => fetch('/api/transactions/?filter=validated'));

  if (isError) {
    return <DataFetchAlert/>;
  }

  if (isLoading) {
    return (
      <>
        <Show below="lg"><TxsSkeletonMobile/></Show>
        <Show above="lg"><TxsSkeletonDesktop/></Show>
      </>
    );
  }

  if (!data || !data.items) {
    return <Alert>There are no transactions.</Alert>;
  }

  return <TxsContent txs={ data.items }/>;
};

export default TxsValidated;
