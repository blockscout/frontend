// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex } from '@chakra-ui/react';
import React from 'react';

import BlockPendingUpdateAlert from 'client/slices/block/components/BlockPendingUpdateAlert';
import type { TxQuery } from 'client/slices/tx/hooks/useTxQuery';

import TestnetWarning from 'ui/shared/alerts/TestnetWarning';
import DataFetchAlert from 'ui/shared/DataFetchAlert';

import TxDetails from './TxDetails';

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
