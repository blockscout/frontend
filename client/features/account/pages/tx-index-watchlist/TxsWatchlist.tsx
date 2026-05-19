// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import TxsWithFrontendSorting from 'client/slices/tx/pages/index/list/TxsWithFrontendSorting';

import useRedirectForInvalidAuthToken from 'client/features/account/hooks/useRedirectForInvalidAuthToken';

import type { QueryWithPagesResult } from 'ui/shared/pagination/useQueryWithPages';

type Props = {
  query: QueryWithPagesResult<'general:txs_watchlist'>;
  top?: number;
};

const TxsWatchlist = ({ query, top }: Props) => {
  useRedirectForInvalidAuthToken();
  return <TxsWithFrontendSorting query={ query } top={ top }/>;
};

export default TxsWatchlist;
