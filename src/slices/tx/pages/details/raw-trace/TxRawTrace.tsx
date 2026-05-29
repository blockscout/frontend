// SPDX-License-Identifier: LicenseRef-Blockscout

import { useRouter } from 'next/router';
import React from 'react';

import type { SocketMessage } from 'src/api/socket/types';
import type { TxRawTracesResponse } from 'src/slices/tx/types/api';

import useApiQuery from 'src/api/hooks/useApiQuery';
import useSocketChannel from 'src/api/socket/useSocketChannel';
import useSocketMessage from 'src/api/socket/useSocketMessage';

import TxPendingAlert from 'src/slices/tx/components/TxPendingAlert';
import TxSocketAlert from 'src/slices/tx/components/TxSocketAlert';
import type { TxQuery } from 'src/slices/tx/hooks/useTxQuery';
import { TX_RAW_TRACE } from 'src/slices/tx/stubs/tx';

import ApiFetchAlert from 'src/shared/alerts/ApiFetchAlert';
import RawDataSnippet from 'src/shared/data/RawDataSnippet';
import getQueryParamString from 'src/shared/router/get-query-param-string';

interface Props {
  txQuery: TxQuery;
}

const TxRawTrace = ({ txQuery }: Props) => {
  const [ isQueryEnabled, setIsQueryEnabled ] = React.useState(false);
  const [ rawTraces, setRawTraces ] = React.useState<TxRawTracesResponse>();
  const router = useRouter();
  const hash = getQueryParamString(router.query.hash);

  const { data, isPlaceholderData, isError } = useApiQuery('core:tx_raw_trace', {
    pathParams: { hash },
    queryOptions: {
      enabled: Boolean(hash) && Boolean(txQuery.data?.status) && isQueryEnabled,
      placeholderData: TX_RAW_TRACE,
    },
  });

  const handleRawTraceMessage: SocketMessage.TxRawTrace['handler'] = React.useCallback((payload) => {
    setRawTraces(payload);
  }, [ ]);

  const enableQuery = React.useCallback(() => setIsQueryEnabled(true), []);

  const channel = useSocketChannel({
    topic: `transactions:${ hash }`,
    isDisabled: !hash || txQuery.isPlaceholderData || !txQuery.data?.status,
    onJoin: enableQuery,
    onSocketError: enableQuery,
  });
  useSocketMessage({
    channel,
    event: 'raw_trace',
    handler: handleRawTraceMessage,
  });

  if (!txQuery.isPending && !txQuery.isPlaceholderData && !txQuery.isError && !txQuery.data.status) {
    return txQuery.socketStatus ? <TxSocketAlert status={ txQuery.socketStatus }/> : <TxPendingAlert/>;
  }

  if (isError || txQuery.isError) {
    return <ApiFetchAlert/>;
  }

  const dataToDisplay = rawTraces ? rawTraces : data;

  if (!isPlaceholderData && dataToDisplay?.length === 0) {
    return <span>No trace entries found.</span>;
  }

  const text = JSON.stringify(dataToDisplay, undefined, 4);

  return <RawDataSnippet data={ text } isLoading={ isPlaceholderData } textareaMaxHeight={{ base: '400px', lg: '600px' }}/>;
};

export default TxRawTrace;
