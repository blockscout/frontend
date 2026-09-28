// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import TxPendingAlert from 'src/slices/tx/components/TxPendingAlert';
import TxSocketAlert from 'src/slices/tx/components/TxSocketAlert';
import type { TxQuery } from 'src/slices/tx/hooks/useTxQuery';

import DataList from 'src/shared/lists/DataList';

import { TableContainerScrollable } from 'src/toolkit/chakra/table';

import TxAuthorizationsTable from './TxAuthorizationsTable';

interface Props {
  txQuery: TxQuery;
}

const TxAuthorizations = ({ txQuery }: Props) => {

  if (!txQuery.isPlaceholderData && !txQuery.isError && !txQuery.data?.status) {
    return txQuery.socketStatus ? <TxSocketAlert status={ txQuery.socketStatus }/> : <TxPendingAlert/>;
  }

  const content = txQuery.data?.authorization_list ? (
    <TableContainerScrollable>
      <TxAuthorizationsTable
        data={ txQuery.data.authorization_list }
        isLoading={ txQuery.isPlaceholderData }
        resetKey={ txQuery.data.hash }
      />
    </TableContainerScrollable>
  ) : null;

  return (
    <DataList
      isError={ txQuery.isError }
      itemsNum={ txQuery.data?.authorization_list?.length }
      emptyText="There are no authorizations for this transaction."
    >
      { content }
    </DataList>
  );
};

export default TxAuthorizations;
