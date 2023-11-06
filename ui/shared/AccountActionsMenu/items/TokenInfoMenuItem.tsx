import { MenuItem, Icon, chakra, useDisclosure } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { Route } from 'nextjs-routes';

import config from 'configs/app';
import iconEdit from 'icons/edit.svg';
import useApiQuery from 'lib/api/useApiQuery';
import useHasAccount from 'lib/hooks/useHasAccount';
import { PAGE_TYPE_DICT } from 'lib/mixpanel/getPageType';
import AddressVerificationModal from 'ui/addressVerification/AddressVerificationModal';

interface Props {
  className?: string;
  hash: string;
  onBeforeClick: (route: Route) => boolean;
}

const TokenInfoMenuItem = ({ className, hash, onBeforeClick }: Props) => {
  const router = useRouter();
  const modal = useDisclosure();
  const isAuth = useHasAccount();

  const verifiedAddressesQuery = useApiQuery('verified_addresses', {
    pathParams: { chainId: config.chain.id },
    queryOptions: {
      enabled: isAuth,
    },
  });
  const applicationsQuery = useApiQuery('token_info_applications', {
    pathParams: { chainId: config.chain.id, id: undefined },
    queryOptions: {
      enabled: isAuth,
    },
  });
  const tokenInfoQuery = useApiQuery('token_verified_info', {
    pathParams: { hash, chainId: config.chain.id },
    queryOptions: {
      refetchOnMount: false,
    },
  });

  const handleAddAddressClick = React.useCallback(() => {
    if (!onBeforeClick({ pathname: '/account/verified-addresses' })) {
      return;
    }

    modal.onOpen();
  }, [ modal, onBeforeClick ]);

  const handleAddApplicationClick = React.useCallback(async() => {
    router.push({ pathname: '/account/verified-addresses', query: { address: hash } });
  }, [ hash, router ]);

  const handleVerifiedAddressSubmit = React.useCallback(async() => {
    await verifiedAddressesQuery.refetch();
  }, [ verifiedAddressesQuery ]);

  const handleShowMyAddressesClick = React.useCallback(async() => {
    router.push({ pathname: '/account/verified-addresses' });
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
        pageType={ PAGE_TYPE_DICT['/token/[hash]'] }
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
