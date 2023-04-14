import { MenuItem, chakra, useDisclosure } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import appConfig from 'configs/app/config';
import useApiQuery from 'lib/api/useApiQuery';
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

  const content = (() => {
    if (!verifiedAddressesQuery.data?.verifiedAddresses.find(({ contractAddress }) => contractAddress === hash)) {
      return (
        <MenuItem className={ className } onClick={ handleAddAddressClick }>
          Add token info
        </MenuItem>
      );
    }

    return (
      <MenuItem className={ className } onClick={ handleAddApplicationClick }>
        { applicationsQuery.data?.submissions.some(({ tokenAddress }) => tokenAddress === hash) ? 'Update token info' : 'Add token info' }
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
