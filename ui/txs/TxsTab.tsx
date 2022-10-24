import React from 'react';

import TxsContent from './TxsContent';

type Props = {
  tab: 'validated' | 'pending';
}

const TxsTab = ({ tab }: Props) => {
  return (
    <TxsContent
      showDescription={ tab === 'validated' }
      stateFilter={ tab }
      apiPath="/api/transactions"
    />
  );
};

export default TxsTab;
