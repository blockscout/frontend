import { Accordion, Hide, Show, Text } from '@chakra-ui/react';
import React from 'react';

import { SECOND } from 'lib/consts';
import { TX_STATE_CHANGES } from 'stubs/txStateChanges';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import TxStateList from 'ui/tx/state/TxStateList';
import TxStateTable from 'ui/tx/state/TxStateTable';
import useFetchTxInfo from 'ui/tx/useFetchTxInfo';

import TxPendingAlert from './TxPendingAlert';
import TxSocketAlert from './TxSocketAlert';

const TxState = () => {
  const txInfo = useFetchTxInfo({ updateDelay: 5 * SECOND });
  const { data, isPlaceholderData, isError, pagination } = useQueryWithPages({
    resourceName: 'tx_state_changes',
    pathParams: { hash: txInfo.data?.hash },
    options: {
      enabled: !txInfo.isPlaceholderData && Boolean(txInfo.data?.hash) && Boolean(txInfo.data?.status),
      placeholderData: {
        items: TX_STATE_CHANGES,
        next_page_params: {
          items_count: 1,
          state_changes: null,
        },
      },
    },
  });

  if (!txInfo.isPending && !txInfo.isPlaceholderData && !txInfo.isError && !txInfo.data.status) {
    return txInfo.socketStatus ? <TxSocketAlert status={ txInfo.socketStatus }/> : <TxPendingAlert/>;
  }

  const content = data ? (
    <Accordion allowMultiple defaultIndex={ [] }>
      <Hide below="lg" ssr={ false }>
        <TxStateTable data={ data.items } isLoading={ isPlaceholderData } top={ pagination.isVisible ? 80 : 0 }/>
      </Hide>
      <Show below="lg" ssr={ false }>
        <TxStateList data={ data.items } isLoading={ isPlaceholderData }/>
      </Show>
    </Accordion>
  ) : null;

  const actionBar = pagination.isVisible ? (
    <ActionBar mt={ -6 } showShadow>
      <Pagination ml="auto" { ...pagination }/>
    </ActionBar>
  ) : null;

  return (
    <>
      <Text mb={ 6 }>
        A set of information that represents the current state is updated when a transaction takes place on the network.
        The below is a summary of those changes.
      </Text>
      <DataListDisplay
        isError={ isError }
        items={ data?.items }
        emptyText="There are no state changes for this transaction."
        content={ content }
        actionBar={ actionBar }
      />
    </>
  );
};

export default TxState;
