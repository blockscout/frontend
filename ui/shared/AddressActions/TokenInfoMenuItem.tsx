import { MenuItem, Icon, chakra, useDisclosure } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';

import type { TokenVerifiedInfo } from 'types/api/token';

import appConfig from 'configs/app/config';
import iconEdit from 'icons/edit.svg';
import useApiQuery, { getResourceKey } from 'lib/api/useApiQuery';
import useRedirectIfNotAuth from 'lib/hooks/useRedirectIfNotAuth';
import AddressVerificationModal from 'ui/addressVerification/AddressVerificationModal';

interface Props {
  className?: string;
  hash: string;
}

const TokenInfoMenuItem = ({ className, hash }: Props) => {
  const router = useRouter();
  const modal = useDisclosure();
  const redirectIfNotAuth = useRedirectIfNotAuth();
  const queryClient = useQueryClient();

  const verifiedAddressesQuery = useApiQuery('verified_addresses', {
    pathParams: { chainId: appConfig.network.id },
  });
  const applicationsQuery = useApiQuery('token_info_applications', {
    pathParams: { chainId: appConfig.network.id, id: undefined },
  });

  const handleAddAddressClick = React.useCallback(() => {
    if (redirectIfNotAuth()) {
      return;
    }

    modal.onOpen();
  }, [ modal, redirectIfNotAuth ]);

  const handleAddApplicationClick = React.useCallback(async() => {
    router.push({ pathname: '/account/verified_addresses', query: { address: hash } });
  }, [ hash, router ]);

  const handleVerifiedAddressSubmit = React.useCallback(async() => {
    await verifiedAddressesQuery.refetch();
  }, [ verifiedAddressesQuery ]);

  const handleShowMyAddressesClick = React.useCallback(async() => {
    router.push({ pathname: '/account/verified_addresses' });
  }, [ router ]);

  const icon = <Icon as={ iconEdit } boxSize={ 6 } mr={ 2 } p={ 1 }/>;

  const content = (() => {
    const verifiedTokenInfo = queryClient.getQueryData<TokenVerifiedInfo>(
      getResourceKey(
        'token_verified_info',
        { pathParams: { hash, chainId: appConfig.network.id } },
      ),
    );

    if (!verifiedAddressesQuery.data?.verifiedAddresses.find(({ contractAddress }) => contractAddress.toLowerCase() === hash.toLowerCase())) {
      return (
        <MenuItem className={ className } onClick={ handleAddAddressClick }>
          { icon }
          <span>{ verifiedTokenInfo?.tokenAddress ? 'Update token info' : 'Add token info' }</span>
        </MenuItem>
      );
    }

    const hasApplication = applicationsQuery.data?.submissions.some(({ tokenAddress }) => tokenAddress.toLowerCase() === hash.toLowerCase());

    return (
      <MenuItem className={ className } onClick={ handleAddApplicationClick }>
        { icon }
        <span>
          {
            hasApplication || verifiedTokenInfo?.tokenAddress ?
              'Update token info' :
              'Add token info'
          }
        </span>
      </MenuItem>
    );
  })();

  return (
    <>
      { content }
      <AddressVerificationModal
        defaultAddress={ hash }
        isOpen={ modal.isOpen }
        onClose={ modal.onClose }
        onSubmit={ handleVerifiedAddressSubmit }
        onAddTokenInfoClick={ handleAddApplicationClick }
        onShowListClick={ handleShowMyAddressesClick }
      />
    </>
  );
};

export default React.memo(chakra(TokenInfoMenuItem));
