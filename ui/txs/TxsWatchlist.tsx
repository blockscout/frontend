import React from 'react';

import useRedirectForInvalidAuthToken from 'lib/hooks/useRedirectForInvalidAuthToken';
import type { QueryWithPagesResult } from 'ui/shared/pagination/useQueryWithPages';
import TxsWithFrontendSorting from 'ui/txs/TxsWithFrontendSorting';

type Props = {
  query: QueryWithPagesResult<'txs_watchlist'>;
}

const TxsWatchlist = ({ query }: Props) => {
  useRedirectForInvalidAuthToken();
  return <TxsWithFrontendSorting query={ query } showSocketInfo={ false }/>;
};

export default TxsWatchlist;
