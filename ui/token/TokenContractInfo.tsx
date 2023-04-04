import type { UseQueryResult } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';

import type { TokenInfo } from 'types/api/token';

import useApiQuery from 'lib/api/useApiQuery';
import * as stubs from 'stubs/address';
import AddressHeadingInfo from 'ui/shared/AddressHeadingInfo';

interface Props {
  tokenQuery: UseQueryResult<TokenInfo>;
}

const TokenContractInfo = ({ tokenQuery }: Props) => {
  const router = useRouter();

  const contractQuery = useApiQuery('address', {
    pathParams: { hash: router.query.hash?.toString() },
    queryOptions: { enabled: Boolean(router.query.hash), placeholderData: stubs.ADDRESS_INFO },
  });

  // we show error in parent component, this is only for TS
  if (tokenQuery.isError) {
    return null;
  }

  const address = {
    hash: tokenQuery.data?.address || '',
    is_contract: true,
    implementation_name: null,
    watchlist_names: [],
  };

  return (
    <AddressHeadingInfo
      address={ address }
      token={ contractQuery.data?.token }
      isLoading={ tokenQuery.isPlaceholderData || contractQuery.isPlaceholderData }
    />
  );
};

export default React.memo(TokenContractInfo);
