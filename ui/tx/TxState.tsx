import { Accordion, Hide, Show, Skeleton, Text } from '@chakra-ui/react';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import { SECOND } from 'lib/consts';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import SkeletonList from 'ui/shared/skeletons/SkeletonList';
import SkeletonTable from 'ui/shared/skeletons/SkeletonTable';
import TxStateList from 'ui/tx/state/TxStateList';
import TxStateTable from 'ui/tx/state/TxStateTable';
import useFetchTxInfo from 'ui/tx/useFetchTxInfo';

import TxPendingAlert from './TxPendingAlert';
import TxSocketAlert from './TxSocketAlert';

const TxState = () => {
  const txInfo = useFetchTxInfo({ updateDelay: 5 * SECOND });
  const { data, isLoading, isError } = useApiQuery('tx_state_changes', {
    pathParams: { hash: txInfo.data?.hash },
    queryOptions: {
      enabled: Boolean(txInfo.data?.hash) && Boolean(txInfo.data?.status),
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
        <Show below="lg" ssr={ false }>
          <Skeleton h={ 4 } borderRadius="full" w="100%"/>
          <Skeleton h={ 4 } borderRadius="full" w="100%" mt={ 2 }/>
          <Skeleton h={ 4 } borderRadius="full" w="100%" mt={ 2 }/>
          <Skeleton h={ 4 } borderRadius="full" w="50%" mt={ 2 } mb={ 6 }/>
          <SkeletonList/>
        </Show>
        <Hide below="lg" ssr={ false }>
          <Skeleton h={ 6 } borderRadius="full" w="90%" mb={ 6 }/>
          <SkeletonTable columns={ [ '28%', '20%', '24px', '20%', '16%', '16%' ] }/>
        </Hide>
      </>
    );
  }

  return (
    <>
      <Text>
        A set of information that represents the current state is updated when a transaction takes place on the network. The below is a summary of those changes
      </Text>
      <Accordion allowMultiple defaultIndex={ [] }>
        <Hide below="lg" ssr={ false }>
          <TxStateTable data={ data }/>
        </Hide>
        <Show below="lg" ssr={ false }>
          <TxStateList data={ data }/>
        </Show>
      </Accordion>
    </>
  );
};

export default TxState;
