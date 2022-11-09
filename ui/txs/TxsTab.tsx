import React from 'react';

import { QueryKeys } from 'types/client/queries';

import TxsContent from './TxsContent';

type Props = {
  tab: 'validated' | 'pending';
}

const TxsTab = ({ tab }: Props) => {
  if (tab === 'validated') {
    return (
      <TxsContent
        queryName={ QueryKeys.txsValidate }
        showDescription
        stateFilter="validated"
        apiPath="/api/transactions"
      />
    );
  }

  return (
    <TxsContent
      queryName={ QueryKeys.txsPending }
      stateFilter="pending"
      apiPath="/api/transactions"
    />
  );
};

export default TxsTab;
