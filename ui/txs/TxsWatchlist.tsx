import React from 'react';

import useRedirectForInvalidAuthToken from 'lib/hooks/useRedirectForInvalidAuthToken';
import type { QueryWithPagesResult } from 'ui/shared/pagination/useQueryWithPages';
import TxsContent from 'ui/txs/TxsContent';

type Props = {
  query: QueryWithPagesResult<'txs_watchlist'>;
}

const TxsWatchlist = ({ query }: Props) => {
  useRedirectForInvalidAuthToken();
  return <TxsContent query={ query } showSocketInfo={ false }/>;
};

export default TxsWatchlist;
