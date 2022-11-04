import { useRouter } from 'next/router';
import React from 'react';

import { QueryKeys } from 'types/client/queries';

import TxsContent from 'ui/txs/TxsContent';

const BlockTxs = () => {
  const router = useRouter();

  return (
    <TxsContent
      queryName={ QueryKeys.blockTxs }
      apiPath={ `/node-api/blocks/${ router.query.id }/transactions` }
    />
  );
};

export default BlockTxs;
