// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import TxPendingAlert from 'client/slices/tx/components/TxPendingAlert';
import TxSocketAlert from 'client/slices/tx/components/TxSocketAlert';
import type { TxQuery } from 'client/slices/tx/hooks/useTxQuery';

import DataListDisplay from 'ui/shared/DataListDisplay';

import TxAuthorizationsList from './TxAuthorizationsList';
import TxAuthorizationsTable from './TxAuthorizationsTable';

interface Props {
  txQuery: TxQuery;
}

const TxAuthorizations = ({ txQuery }: Props) => {

  if (!txQuery.isPlaceholderData && !txQuery.isError && !txQuery.data?.status) {
    return txQuery.socketStatus ? <TxSocketAlert status={ txQuery.socketStatus }/> : <TxPendingAlert/>;
  }

  const content = (
    <>
      <Box hideFrom="lg">
        <TxAuthorizationsList data={ txQuery.data?.authorization_list } isLoading={ txQuery.isPlaceholderData }/>
      </Box>
      <Box hideBelow="lg">
        <TxAuthorizationsTable data={ txQuery.data?.authorization_list } isLoading={ txQuery.isPlaceholderData }/>
      </Box>
    </>
  );

  return (
    <DataListDisplay
      isError={ txQuery.isError }
      itemsNum={ txQuery.data?.authorization_list?.length }
      emptyText="There are no authorizations for this transaction."
    >
      { content }
    </DataListDisplay>
  );
};

export default TxAuthorizations;
