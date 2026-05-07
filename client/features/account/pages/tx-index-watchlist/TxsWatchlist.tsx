import React from 'react';

import TxsWithFrontendSorting from 'client/slices/tx/pages/index/list/TxsWithFrontendSorting';

import type { QueryWithPagesResult } from 'ui/shared/pagination/useQueryWithPages';
import useRedirectForInvalidAuthToken from 'ui/snippets/auth/useRedirectForInvalidAuthToken';

type Props = {
  query: QueryWithPagesResult<'general:txs_watchlist'>;
  top?: number;
};

const TxsWatchlist = ({ query, top }: Props) => {
  useRedirectForInvalidAuthToken();
  return <TxsWithFrontendSorting query={ query } top={ top }/>;
};

export default TxsWatchlist;
