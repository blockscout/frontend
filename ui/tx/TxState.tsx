import { Accordion, Hide, Show, Skeleton, Text } from '@chakra-ui/react';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import { SECOND } from 'lib/consts';
import DataListDisplay from 'ui/shared/DataListDisplay';
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

  const skeleton = (
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
        <SkeletonTable columns={ [ '140px', '146px', '33%', '33%', '33%', '150px' ] }/>
      </Hide>
    </>
  );

  const content = data ? (
    <>
      <Text>
        A set of information that represents the current state is updated when a transaction takes place on the network.
        The below is a summary of those changes.
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
  ) : null;

  return (
    <DataListDisplay
      isError={ isError }
      isLoading={ isLoading }
      items={ data }
      emptyText="There are no state changes for this transaction."
      content={ content }
      skeletonProps={{ customSkeleton: skeleton }}
    />
  );
};

export default TxState;
