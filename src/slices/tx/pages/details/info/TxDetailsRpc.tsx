// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex } from '@chakra-ui/react';
import React from 'react';

import TestnetWarning from 'src/slices/chain/TestnetWarning';
import type { TxQuery } from 'src/slices/tx/hooks/useTxQuery';

import ApiDegradationAlert from 'src/shared/api-degradation/ApiDegradationAlert';

import TxDetails from './TxDetails';

interface Props {
  txQuery: TxQuery;
}

const TxDetailsRpc = ({ txQuery }: Props) => {
  return (
    <>
      <Flex rowGap={{ base: 1, lg: 2 }} mb={{ base: 3, lg: 6 }} flexDir="column">
        <TestnetWarning isLoading={ txQuery.isPlaceholderData }/>
        { /* on a 404 the API is not degraded, the transaction just is not indexed yet */ }
        { txQuery.apiError?.status !== 404 && <ApiDegradationAlert isLoading={ txQuery.isPlaceholderData }/> }
      </Flex>
      <TxDetails data={ txQuery.data } isLoading={ txQuery.isPlaceholderData } noTxActions/>
    </>
  );
};

export default React.memo(TxDetailsRpc);
