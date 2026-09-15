// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import TxsWithFrontendSorting from 'src/slices/tx/pages/index/list/TxsWithFrontendSorting';

import useRedirectForInvalidAuthToken from 'src/features/account/hooks/useRedirectForInvalidAuthToken';

import type { ApiPaginatedQueryResult } from 'src/shared/pagination/useApiPaginatedQuery';

type Props = {
  query: ApiPaginatedQueryResult<'core:txs_watchlist'>;
  top?: number;
};

const TxsWatchlist = ({ query, top }: Props) => {
  useRedirectForInvalidAuthToken();
  return <TxsWithFrontendSorting query={ query } top={ top }/>;
};

export default TxsWatchlist;
