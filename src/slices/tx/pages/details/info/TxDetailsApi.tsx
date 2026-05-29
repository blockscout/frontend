// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex } from '@chakra-ui/react';
import React from 'react';

import BlockPendingUpdateAlert from 'src/slices/block/components/BlockPendingUpdateAlert';
import TestnetWarning from 'src/slices/chain/TestnetWarning';
import type { TxQuery } from 'src/slices/tx/hooks/useTxQuery';

import ApiFetchAlert from 'src/shared/alerts/ApiFetchAlert';

import TxDetails from './TxDetails';

interface Props {
  txQuery: TxQuery;
}

const TxDetailsApi = ({ txQuery }: Props) => {
  if (txQuery.isError) {
    return <ApiFetchAlert/>;
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
