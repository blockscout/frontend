import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { Address } from 'types/api/address';
import type { TokenInfo } from 'types/api/token';

import AddressHeadingInfo from 'ui/shared/AddressHeadingInfo';

interface Props {
  tokenQuery: UseQueryResult<TokenInfo>;
  contractQuery: UseQueryResult<Address>;
}

const TokenContractInfo = ({ tokenQuery, contractQuery }: Props) => {
  // we show error in parent component, this is only for TS
  if (tokenQuery.isError) {
    return null;
  }

  const address = {
    hash: tokenQuery.data?.address || '',
    is_contract: true,
    implementation_name: null,
    watchlist_names: [],
    watchlist_address_id: null,
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
