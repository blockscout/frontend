import React from 'react';

import type { QueryWithPagesResult } from 'ui/shared/pagination/useQueryWithPages';
import useRedirectForInvalidAuthToken from 'ui/snippets/auth/useRedirectForInvalidAuthToken';
import TxsWithFrontendSorting from 'ui/txs/TxsWithFrontendSorting';

type Props = {
  query: QueryWithPagesResult<'general:txs_watchlist'>;
};

const TxsWatchlist = ({ query }: Props) => {
  useRedirectForInvalidAuthToken();
  return <TxsWithFrontendSorting query={ query } top={ 88 }/>;
};

export default TxsWatchlist;
