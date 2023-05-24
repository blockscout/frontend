import { Accordion, Hide, Show, Text } from '@chakra-ui/react';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import { SECOND } from 'lib/consts';
import { TX_STATE_CHANGES } from 'stubs/txStateChanges';
import DataListDisplay from 'ui/shared/DataListDisplay';
import TxStateList from 'ui/tx/state/TxStateList';
import TxStateTable from 'ui/tx/state/TxStateTable';
import useFetchTxInfo from 'ui/tx/useFetchTxInfo';

import TxPendingAlert from './TxPendingAlert';
import TxSocketAlert from './TxSocketAlert';

const TxState = () => {
  const txInfo = useFetchTxInfo({ updateDelay: 5 * SECOND });
  const { data, isPlaceholderData, isError } = useApiQuery('tx_state_changes', {
    pathParams: { hash: txInfo.data?.hash },
    queryOptions: {
      enabled: Boolean(txInfo.data?.hash) && Boolean(txInfo.data?.status),
      placeholderData: TX_STATE_CHANGES,
    },
  });

  if (!txInfo.isLoading && !txInfo.isPlaceholderData && !txInfo.isError && !txInfo.data.status) {
    return txInfo.socketStatus ? <TxSocketAlert status={ txInfo.socketStatus }/> : <TxPendingAlert/>;
  }

  const content = data ? (
    <Accordion allowMultiple defaultIndex={ [] }>
      <Hide below="lg" ssr={ false }>
        <TxStateTable data={ data } isLoading={ isPlaceholderData }/>
      </Hide>
      <Show below="lg" ssr={ false }>
        <TxStateList data={ data } isLoading={ isPlaceholderData }/>
      </Show>
    </Accordion>
  ) : null;

  return (
    <>
      <Text mb={ 6 }>
        A set of information that represents the current state is updated when a transaction takes place on the network.
        The below is a summary of those changes.
      </Text>
      <DataListDisplay
        isError={ isError }
        isLoading={ false }
        items={ data }
        emptyText="There are no state changes for this transaction."
        content={ content }
        skeletonProps={{ customSkeleton: null }}
      />
    </>
  );
};

export default TxState;
