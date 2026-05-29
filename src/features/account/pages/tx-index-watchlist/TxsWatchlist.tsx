// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import TxsWithFrontendSorting from 'src/slices/tx/pages/index/list/TxsWithFrontendSorting';

import useRedirectForInvalidAuthToken from 'src/features/account/hooks/useRedirectForInvalidAuthToken';

import type { QueryWithPagesResult } from 'src/shared/pagination/useQueryWithPages';

type Props = {
  query: QueryWithPagesResult<'general:txs_watchlist'>;
  top?: number;
};

const TxsWatchlist = ({ query, top }: Props) => {
  useRedirectForInvalidAuthToken();
  return <TxsWithFrontendSorting query={ query } top={ top }/>;
};

export default TxsWatchlist;
