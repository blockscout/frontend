import { Flex } from '@chakra-ui/react';
import React from 'react';

import TestnetWarning from 'ui/shared/alerts/TestnetWarning';
import BlockPendingUpdateAlert from 'ui/shared/block/BlockPendingUpdateAlert';
import DataFetchAlert from 'ui/shared/DataFetchAlert';

import TxDetails from './details/TxDetails';
import type { TxQuery } from './useTxQuery';

interface Props {
  txQuery: TxQuery;
}

const TxDetailsApi = ({ txQuery }: Props) => {
  if (txQuery.isError) {
    return <DataFetchAlert/>;
  }

  return (
    <>
      <Flex rowGap={{ base: 1, lg: 2 }} mb={{ base: 3, lg: 6 }} flexDir="column">
        <TestnetWarning isLoading={ txQuery.isPlaceholderData }/>
        { txQuery.data?.is_pending_update && <BlockPendingUpdateAlert view="tx"/> }
      </Flex>
      <TxDetails
        data={ txQuery.data }
        isLoading={ txQuery.isPlaceholderData }
        socketStatus={ txQuery.socketStatus }
      />
    </>
  );
};

export default React.memo(TxDetailsApi);
