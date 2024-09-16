import { Box, Flex, Tooltip, useToken } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { Address } from 'types/api/address';
import type { TokenInfo } from 'types/api/token';
import type { EntityTag } from 'ui/shared/EntityTags/types';

import config from 'configs/app';
import useAddressMetadataInfoQuery from 'lib/address/useAddressMetadataInfoQuery';
import type { ResourceError } from 'lib/api/resources';
import useApiQuery from 'lib/api/useApiQuery';
import { useAppContext } from 'lib/contexts/app';
import { getTokenTypeName } from 'lib/token/tokenTypes';
import AddressQrCode from 'ui/address/details/AddressQrCode';
import AccountActionsMenu from 'ui/shared/AccountActionsMenu/AccountActionsMenu';
import AddressAddToWallet from 'ui/shared/address/AddressAddToWallet';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import * as TokenEntity from 'ui/shared/entities/token/TokenEntity';
import EntityTags from 'ui/shared/EntityTags/EntityTags';
import formatUserTags from 'ui/shared/EntityTags/formatUserTags';
import sortEntityTags from 'ui/shared/EntityTags/sortEntityTags';
import IconSvg from 'ui/shared/IconSvg';
import NetworkExplorers from 'ui/shared/NetworkExplorers';
import PageTitle from 'ui/shared/Page/PageTitle';

import TokenVerifiedInfo from './TokenVerifiedInfo';

interface Props {
  tokenQuery: UseQueryResult<TokenInfo, ResourceError<unknown>>;
  addressQuery: UseQueryResult<Address, ResourceError<unknown>>;
  hash: string;
}

const TokenPageTitle = ({ tokenQuery, addressQuery, hash }: Props) => {
  const appProps = useAppContext();
  const addressHash = !tokenQuery.isPlaceholderData ? (tokenQuery.data?.address || '') : '';

  const verifiedInfoQuery = useApiQuery('token_verified_info', {
    pathParams: { hash: addressHash, chainId: config.chain.id },
    queryOptions: { enabled: Boolean(tokenQuery.data) && !tokenQuery.isPlaceholderData && config.features.verifiedTokens.isEnabled },
  });

  const addressesForMetadataQuery = React.useMemo(() => ([ hash ].filter(Boolean)), [ hash ]);
  const addressMetadataQuery = useAddressMetadataInfoQuery(addressesForMetadataQuery);

  const isLoading = tokenQuery.isPlaceholderData ||
    addressQuery.isPlaceholderData ||
    (config.features.verifiedTokens.isEnabled && verifiedInfoQuery.isPending);

  const tokenSymbolText = tokenQuery.data?.symbol ? ` (${ tokenQuery.data.symbol })` : '';

  const backLink = React.useMemo(() => {
    const hasGoBackLink = appProps.referrer && appProps.referrer.includes('/tokens');

    if (!hasGoBackLink) {
      return;
    }

    return {
      label: 'Back to tokens list',
      url: appProps.referrer,
    };
  }, [ appProps.referrer ]);

  const bridgedTokenTagBgColor = useToken('colors', 'blue.500');
  const bridgedTokenTagTextColor = useToken('colors', 'white');

  const tags: Array<EntityTag> = React.useMemo(() => {
    return [
      tokenQuery.data ? { slug: tokenQuery.data?.type, name: getTokenTypeName(tokenQuery.data.type), tagType: 'custom' as const, ordinal: -20 } : undefined,
      config.features.bridgedTokens.isEnabled && tokenQuery.data?.is_bridged ?
        {
          slug: 'bridged',
          name: 'Bridged',
          tagType: 'custom' as const,
          ordinal: -10,
          meta: { bgColor: bridgedTokenTagBgColor, textColor: bridgedTokenTagTextColor },
        } :
        undefined,
      ...formatUserTags(addressQuery.data),
      verifiedInfoQuery.data?.projectSector ?
        { slug: verifiedInfoQuery.data.projectSector, name: verifiedInfoQuery.data.projectSector, tagType: 'custom' as const, ordinal: -30 } :
        undefined,
      ...(addressMetadataQuery.data?.addresses?.[hash.toLowerCase()]?.tags || []),
    ].filter(Boolean).sort(sortEntityTags);
  }, [
    addressMetadataQuery.data?.addresses,
    addressQuery.data,
    bridgedTokenTagBgColor,
    bridgedTokenTagTextColor,
    tokenQuery.data,
    verifiedInfoQuery.data?.projectSector,
    hash,
  ]);

  const contentAfter = (
    <>
      { verifiedInfoQuery.data?.tokenAddress && (
        <Tooltip label={ `Information on this token has been verified by ${ config.chain.name }` }>
          <Box boxSize={ 6 }>
            <IconSvg name="certified" color="green.500" boxSize={ 6 } cursor="pointer"/>
          </Box>
        </Tooltip>
      ) }
      <EntityTags
        isLoading={ isLoading || (config.features.addressMetadata.isEnabled && addressMetadataQuery.isPending) }
        tags={ tags }
        flexGrow={ 1 }
      />
    </>
  );

  const secondRow = (
    <Flex alignItems="center" w="100%" minW={ 0 } columnGap={ 2 } rowGap={ 2 } flexWrap={{ base: 'wrap', lg: 'nowrap' }}>
      { addressQuery.data && (
        <AddressEntity
          address={{ ...addressQuery.data, name: '' }}
          isLoading={ isLoading }
          fontFamily="heading"
          fontSize="lg"
          fontWeight={ 500 }
        />
      ) }
      { !isLoading && tokenQuery.data && <AddressAddToWallet token={ tokenQuery.data } variant="button"/> }
      <AddressQrCode address={ addressQuery.data } isLoading={ isLoading }/>
      <AccountActionsMenu isLoading={ isLoading }/>
      <Flex ml={{ base: 0, lg: 'auto' }} columnGap={ 2 } flexGrow={{ base: 1, lg: 0 }}>
        <TokenVerifiedInfo verifiedInfoQuery={ verifiedInfoQuery }/>
        <NetworkExplorers type="token" pathParam={ addressHash } ml={{ base: 'auto', lg: 0 }}/>
      </Flex>
    </Flex>
  );

  return (
    <PageTitle
      title={ `${ tokenQuery.data?.name || 'Unnamed token' }${ tokenSymbolText }` }
      isLoading={ tokenQuery.isPlaceholderData }
      backLink={ backLink }
      beforeTitle={ tokenQuery.data ? (
        <TokenEntity.Icon
          token={ tokenQuery.data }
          isLoading={ tokenQuery.isPlaceholderData }
          size="lg"
        />
      ) : null }
      contentAfter={ contentAfter }
      secondRow={ secondRow }
    />
  );
};

export default TokenPageTitle;
