import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { TxsResponse } from 'types/api/transaction';

import useRedirectForInvalidAuthToken from 'lib/hooks/useRedirectForInvalidAuthToken';
import type { Props as PaginationProps } from 'ui/shared/Pagination';
import TxsContent from 'ui/txs/TxsContent';

type QueryResult = UseQueryResult<TxsResponse> & {
  pagination: PaginationProps;
  isPaginationVisible: boolean;
};

type Props = {
  query: QueryResult;
}

const TxsWatchlist = ({ query }: Props) => {
  useRedirectForInvalidAuthToken();
  return <TxsContent query={ query } showSocketInfo={ false }/>;
};

export default TxsWatchlist;
