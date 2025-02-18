import { Show, Hide } from '@chakra-ui/react';
import React from 'react';

import DataListDisplay from 'ui/shared/DataListDisplay';
import TxPendingAlert from 'ui/tx/TxPendingAlert';
import TxSocketAlert from 'ui/tx/TxSocketAlert';

import TxAuthorizationsList from './authorizations/TxAuthorizationsList';
import TxAuthorizationsTable from './authorizations/TxAuthorizationsTable';
import type { TxQuery } from './useTxQuery';

interface Props {
  txQuery: TxQuery;
}

const TxAuthorizations = ({ txQuery }: Props) => {

  if (!txQuery.isPlaceholderData && !txQuery.isError && !txQuery.data?.status) {
    return txQuery.socketStatus ? <TxSocketAlert status={ txQuery.socketStatus }/> : <TxPendingAlert/>;
  }

  const content = (
    <>
      <Show below="lg" ssr={ false }>
        <TxAuthorizationsList data={ txQuery.data?.authorization_list } isLoading={ txQuery.isPlaceholderData }/>
      </Show>
      <Hide below="lg" ssr={ false }>
        <TxAuthorizationsTable data={ txQuery.data?.authorization_list } isLoading={ txQuery.isPlaceholderData }/>
      </Hide>
    </>
  );

  return (
    <DataListDisplay
      isError={ txQuery.isError }
      items={ txQuery.data?.authorization_list }
      emptyText="There are no authorizations for this transaction."
      content={ content }
    />
  );
};

export default TxAuthorizations;
