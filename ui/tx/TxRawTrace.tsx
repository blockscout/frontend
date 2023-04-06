import { Flex, Skeleton } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { SocketMessage } from 'lib/socket/types';
import type { RawTracesResponse } from 'types/api/rawTrace';

import useApiQuery from 'lib/api/useApiQuery';
import { SECOND } from 'lib/consts';
import getQueryParamString from 'lib/router/getQueryParamString';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import RawDataSnippet from 'ui/shared/RawDataSnippet';
import TxPendingAlert from 'ui/tx/TxPendingAlert';
import TxSocketAlert from 'ui/tx/TxSocketAlert';
import useFetchTxInfo from 'ui/tx/useFetchTxInfo';

const TxRawTrace = () => {
  const [ isSocketOpen, setIsSocketOpen ] = React.useState(false);
  const [ rawTraces, setRawTraces ] = React.useState<RawTracesResponse>();
  const router = useRouter();
  const hash = getQueryParamString(router.query.hash);

  const txInfo = useFetchTxInfo({ updateDelay: 5 * SECOND });
  const { data, isLoading, isError } = useApiQuery('tx_raw_trace', {
    pathParams: { hash },
    queryOptions: {
      enabled: Boolean(hash) && Boolean(txInfo.data?.status) && isSocketOpen,
    },
  });

  const handleRawTraceMessage: SocketMessage.TxRawTrace['handler'] = React.useCallback((payload) => {
    setRawTraces(payload);
  }, [ ]);

  const channel = useSocketChannel({
    topic: `transactions:${ hash }`,
    isDisabled: !hash || !txInfo.data?.status,
    onJoin: () => setIsSocketOpen(true),
  });
  useSocketMessage({
    channel,
    event: 'raw_trace',
    handler: handleRawTraceMessage,
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

  const dataToDisplay = rawTraces ? rawTraces : data;

  if (dataToDisplay.length === 0) {
    return <span>No trace entries found.</span>;
  }

  const text = JSON.stringify(dataToDisplay, undefined, 4);

  return <RawDataSnippet data={ text }/>;
};

export default TxRawTrace;
