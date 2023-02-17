import { Flex, Skeleton } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import { SECOND } from 'lib/consts';
import getQueryParamString from 'lib/router/getQueryParamString';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import RawDataSnippet from 'ui/shared/RawDataSnippet';
import TxPendingAlert from 'ui/tx/TxPendingAlert';
import TxSocketAlert from 'ui/tx/TxSocketAlert';
import useFetchTxInfo from 'ui/tx/useFetchTxInfo';

const TxRawTrace = () => {
  const router = useRouter();
  const hash = getQueryParamString(router.query.hash);

  const txInfo = useFetchTxInfo({ updateDelay: 5 * SECOND });
  const { data, isLoading, isError } = useApiQuery('tx_raw_trace', {
    pathParams: { hash },
    queryOptions: {
      enabled: Boolean(hash) && Boolean(txInfo.data?.status),
    },
  });

  if (!txInfo.isLoading && !txInfo.isError && !txInfo.data.status) {
    return txInfo.socketStatus ? <TxSocketAlert status={ txInfo.socketStatus }/> : <TxPendingAlert/>;
  }

  if (isError || txInfo.isError) {
    return <DataFetchAlert/>;
  }

  if (isLoading || txInfo.isLoading) {
    return (
      <>
        <Flex justifyContent="end" mb={ 2 }>
          <Skeleton w={ 5 } h={ 5 }/>
        </Flex>
        <Skeleton w="100%" h="500px"/>
      </>
    );
  }

  if (data.length === 0) {
    return <span>No trace entries found.</span>;
  }

  const text = JSON.stringify(data, undefined, 4);

  return <RawDataSnippet data={ text }/>;
};

export default TxRawTrace;
