import { Flex, Skeleton, SkeletonCircle } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';

import type { TokenInfo } from 'types/api/tokenInfo';

import useApiQuery from 'lib/api/useApiQuery';
import useIsMobile from 'lib/hooks/useIsMobile';
import AddressAddToMetaMask from 'ui/address/details/AddressAddToMetaMask';
import AddressFavoriteButton from 'ui/address/details/AddressFavoriteButton';
import AddressQrCode from 'ui/address/details/AddressQrCode';
import AddressContractIcon from 'ui/shared/address/AddressContractIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import CopyToClipboard from 'ui/shared/CopyToClipboard';

interface Props {
  tokenQuery: UseQueryResult<TokenInfo>;
}

const TokenContractInfo = ({ tokenQuery }: Props) => {
  const router = useRouter();
  const isMobile = useIsMobile();

  const contractQuery = useApiQuery('address', {
    pathParams: { id: router.query.hash?.toString() },
    queryOptions: { enabled: Boolean(router.query.hash) },
  });

  if (tokenQuery.isLoading || contractQuery.isLoading) {
    return (
      <Flex alignItems="center">
        <SkeletonCircle boxSize={ 6 }/>
        <Skeleton w="400px" h={ 5 } ml={ 2 }/>
        <Skeleton w={ 5 } h={ 5 } ml={ 1 }/>
        <Skeleton w={ 9 } h={ 8 } ml={ 2 }/>
        <Skeleton w={ 9 } h={ 8 } ml={ 3 }/>
        <Skeleton w={ 9 } h={ 8 } ml={ 2 }/>
      </Flex>
    );
  }

  // we show error in parent component, this is only for TS
  if (tokenQuery.isError) {
    return null;
  }

  const hash = tokenQuery.data.address;

  return (
    <Flex alignItems="center">
      <AddressContractIcon/>
      <AddressLink hash={ hash } ml={ 2 } truncation={ isMobile ? 'constant' : 'none' }/>
      <CopyToClipboard text={ hash } ml={ 1 }/>
      { contractQuery.data?.token && <AddressAddToMetaMask token={ contractQuery.data?.token } ml={ 2 }/> }
      <AddressFavoriteButton hash={ hash } isAdded={ Boolean(contractQuery.data?.watchlist_names?.length) } ml={ 3 }/>
      <AddressQrCode hash={ hash } ml={ 2 }/>
    </Flex>
  );
};

export default React.memo(TokenContractInfo);
