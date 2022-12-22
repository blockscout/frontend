import { Flex, Textarea, Skeleton } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';

import type { RawTracesResponse } from 'types/api/rawTrace';
import { QueryKeys } from 'types/client/queries';

import { SECOND } from 'lib/consts';
import useFetch from 'lib/hooks/useFetch';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import TxPendingAlert from 'ui/tx/TxPendingAlert';
import TxSocketAlert from 'ui/tx/TxSocketAlert';
import useFetchTxInfo from 'ui/tx/useFetchTxInfo';

const TxRawTrace = () => {
  const router = useRouter();
  const fetch = useFetch();

  const txInfo = useFetchTxInfo({ updateDelay: 5 * SECOND });
  const { data, isLoading, isError } = useQuery<unknown, unknown, RawTracesResponse>(
    [ QueryKeys.txRawTrace, router.query.id ],
    async() => await fetch(`/node-api/transactions/${ router.query.id }/raw-trace`),
    {
      enabled: Boolean(router.query.id) && Boolean(txInfo.data?.status),
    },
  );

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
    return <span>There is no raw trace for this transaction.</span>;
  }

  const text = JSON.stringify(data, undefined, 4);

  return (
    <>
      <Flex justifyContent="end" mb={ 2 }>
        <CopyToClipboard text={ text }/>
      </Flex>
      <Textarea
        variant="filledInactive"
        minHeight="500px"
        p={ 4 }
        value={ text }
      />
    </>
  );
};

export default TxRawTrace;
