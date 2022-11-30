import { useRouter } from 'next/router';
import React from 'react';

import { QueryKeys } from 'types/client/queries';

import useQueryWithPages from 'lib/hooks/useQueryWithPages';
import TxsContent from 'ui/txs/TxsContent';

const BlockTxs = () => {
  const router = useRouter();
  const txsQuery = useQueryWithPages({
    apiPath: `/node-api/blocks/${ router.query.id }/transactions`,
    queryName: QueryKeys.blockTxs,
  });

  return (
    <TxsContent
      query={ txsQuery }
      showBlockInfo={ false }
    />
  );
};

export default BlockTxs;
