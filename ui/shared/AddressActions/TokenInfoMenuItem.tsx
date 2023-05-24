import { MenuItem, Icon, chakra, useDisclosure } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import appConfig from 'configs/app/config';
import iconEdit from 'icons/edit.svg';
import useApiQuery from 'lib/api/useApiQuery';
import useHasAccount from 'lib/hooks/useHasAccount';
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
  const isAuth = useHasAccount();

  const verifiedAddressesQuery = useApiQuery('verified_addresses', {
    pathParams: { chainId: appConfig.network.id },
    queryOptions: {
      enabled: isAuth,
    },
  });
  const applicationsQuery = useApiQuery('token_info_applications', {
    pathParams: { chainId: appConfig.network.id, id: undefined },
    queryOptions: {
      enabled: isAuth,
    },
  });
  const tokenInfoQuery = useApiQuery('token_verified_info', {
    pathParams: { hash, chainId: appConfig.network.id },
    queryOptions: {
      refetchOnMount: false,
    },
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
    if (!verifiedAddressesQuery.data?.verifiedAddresses.find(({ contractAddress }) => contractAddress.toLowerCase() === hash.toLowerCase())) {
      return (
        <MenuItem className={ className } onClick={ handleAddAddressClick }>
          { icon }
          <span>{ tokenInfoQuery.data?.tokenAddress ? 'Update token info' : 'Add token info' }</span>
        </MenuItem>
      );
    }

    const hasApplication = applicationsQuery.data?.submissions.some(({ tokenAddress }) => tokenAddress.toLowerCase() === hash.toLowerCase());

    return (
      <MenuItem className={ className } onClick={ handleAddApplicationClick }>
        { icon }
        <span>
          {
            hasApplication || tokenInfoQuery.data?.tokenAddress ?
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
