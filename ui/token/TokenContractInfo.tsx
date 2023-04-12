import { Flex, Skeleton, SkeletonCircle } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';

import type { TokenInfo } from 'types/api/token';

import appConfig from 'configs/app/config';
import useApiQuery from 'lib/api/useApiQuery';
import AddressHeadingInfo from 'ui/shared/AddressHeadingInfo';

import TokenDetailsActions from './TokenDetails/TokenDetailsActions';

interface Props {
  tokenQuery: UseQueryResult<TokenInfo>;
}

const TokenContractInfo = ({ tokenQuery }: Props) => {
  const router = useRouter();

  const contractQuery = useApiQuery('address', {
    pathParams: { hash: router.query.hash?.toString() },
    queryOptions: { enabled: Boolean(router.query.hash) },
  });

  if (tokenQuery.isLoading || contractQuery.isLoading) {
    return (
      <Flex alignItems="center">
        <SkeletonCircle boxSize={ 6 }/>
        <Skeleton w="400px" h={ 5 } ml={ 2 }/>
        <Skeleton w={ 5 } h={ 5 } ml={ 1 }/>
        <Skeleton w={ 9 } h={ 8 } ml={ 2 }/>
        <Skeleton w={ 9 } h={ 8 } ml={ 2 }/>
      </Flex>
    );
  }

  // we show error in parent component, this is only for TS
  if (tokenQuery.isError) {
    return null;
  }

  const address = {
    hash: tokenQuery.data.address,
    is_contract: true,
    implementation_name: null,
    watchlist_names: [],
  };

  return (
    <AddressHeadingInfo
      address={ address }
      token={ contractQuery.data?.token }
      after={ appConfig.isAccountSupported ? <TokenDetailsActions/> : null }
    />
  );
};

export default React.memo(TokenContractInfo);
