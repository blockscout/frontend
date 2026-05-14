// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex, useToken } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { TokenVerifiedInfo as TTokenVerifiedInfo } from 'client/features/verified-tokens/types/api';
import type { Address } from 'client/slices/address/types/api';
import type { TokenInfo } from 'client/slices/token/types/api';
import { getTokenTypeName } from 'client/slices/token/utils/token-types';
import type { EntityTag } from 'ui/shared/EntityTags/types';

import type { ResourceError } from 'client/api/resources';

import AddressEntity from 'client/slices/address/components/entity/AddressEntity';
import AddressAlerts from 'client/slices/address/pages/details/info/AddressAlerts';
import AddressQrCode from 'client/slices/address/pages/details/info/AddressQrCode';
import * as TokenEntity from 'client/slices/token/components/entity/TokenEntity';

import useAddressMetadataInfoQuery from 'client/features/address-metadata/hooks/useAddressMetadataInfoQuery';
import TokenVerifiedInfo from 'client/features/verified-tokens/pages/token/TokenVerifiedInfo';
import TokenAddToWallet from 'client/features/web3-wallet/components/TokenAddToWallet';

import config from 'configs/app';
import { useMultichainContext } from 'lib/contexts/multichain';
import { Tooltip } from 'toolkit/chakra/tooltip';
import AccountActionsMenu from 'ui/shared/AccountActionsMenu/AccountActionsMenu';
import EntityTags from 'ui/shared/EntityTags/EntityTags';
import formatUserTags from 'ui/shared/EntityTags/formatUserTags';
import sortEntityTags from 'ui/shared/EntityTags/sortEntityTags';
import IconSvg from 'ui/shared/IconSvg';
import NetworkExplorers from 'ui/shared/NetworkExplorers';
import PageTitle from 'ui/shared/Page/PageTitle';

const PREDEFINED_TAG_PRIORITY = 100;

interface Props {
  tokenQuery: UseQueryResult<TokenInfo, ResourceError<unknown>>;
  addressQuery: UseQueryResult<Address, ResourceError<unknown>>;
  verifiedInfoQuery: UseQueryResult<TTokenVerifiedInfo, ResourceError<unknown>>;
  hash: string;
}

const TokenPageTitle = ({ tokenQuery, addressQuery, verifiedInfoQuery, hash }: Props) => {
  const multichainContext = useMultichainContext();
  const addressHash = !tokenQuery.isPlaceholderData ? (tokenQuery.data?.address_hash || '') : '';

  const addressesForMetadataQuery = React.useMemo(() => ([ hash ].filter(Boolean)), [ hash ]);
  const addressMetadataQuery = useAddressMetadataInfoQuery(addressesForMetadataQuery);

  const isLoading = tokenQuery.isPlaceholderData ||
    addressQuery.isPlaceholderData ||
    (config.features.verifiedTokens.isEnabled && verifiedInfoQuery.isPending);

  const tokenSymbolText = tokenQuery.data?.symbol ? ` (${ tokenQuery.data.symbol })` : '';

  const [ bridgedTokenTagBgColor ] = useToken('colors', 'blue.500');
  const [ bridgedTokenTagTextColor ] = useToken('colors', 'white');

  const tags: Array<EntityTag> = React.useMemo(() => {
    return [
      tokenQuery.data ? {
        slug: tokenQuery.data?.type,
        name: getTokenTypeName(tokenQuery.data.type, multichainContext?.chain?.app_config),
        tagType: 'custom' as const,
        ordinal: PREDEFINED_TAG_PRIORITY,
      } : undefined,
      config.features.bridgedTokens.isEnabled && tokenQuery.data?.is_bridged ?
        {
          slug: 'bridged',
          name: 'Bridged',
          tagType: 'custom' as const,
          ordinal: PREDEFINED_TAG_PRIORITY,
          meta: { bgColor: bridgedTokenTagBgColor, textColor: bridgedTokenTagTextColor },
        } :
        undefined,
      ...formatUserTags(addressQuery.data),
      verifiedInfoQuery.data?.projectSector ?
        { slug: verifiedInfoQuery.data.projectSector, name: verifiedInfoQuery.data.projectSector, tagType: 'custom' as const, ordinal: -30 } :
        undefined,
      ...(addressMetadataQuery.data?.addresses?.[hash.toLowerCase()]?.tags.filter(tag => tag.tagType !== 'note') || []),
    ].filter(Boolean).sort(sortEntityTags);
  }, [
    addressMetadataQuery.data?.addresses,
    addressQuery.data,
    bridgedTokenTagBgColor,
    bridgedTokenTagTextColor,
    tokenQuery.data,
    verifiedInfoQuery.data?.projectSector,
    hash,
    multichainContext?.chain?.app_config,
  ]);

  const contentAfter = (
    <>
      { tokenQuery.data && <TokenEntity.Reputation value={ tokenQuery.data.reputation } ml={ 0 }/> }
      { verifiedInfoQuery.data?.tokenAddress && (
        <Tooltip content={ `Information on this token has been verified by ${ config.chain.name }` }>
          <IconSvg name="certified" color="green.500" boxSize={ 6 } cursor="pointer"/>
        </Tooltip>
      ) }
      <EntityTags
        isLoading={ isLoading || (config.features.addressMetadata.isEnabled && addressMetadataQuery.isPending) }
        tags={ tags }
        addressHash={ addressQuery.data?.hash }
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
          variant="subheading"
          icon={ multichainContext?.chain ? {
            shield: { name: 'pie_chart', isLoading },
          } : undefined }
        />
      ) }
      { !isLoading && tokenQuery.data && <TokenAddToWallet token={ tokenQuery.data } variant="button"/> }
      { addressQuery.data && <AddressQrCode hash={ addressQuery.data.hash } isLoading={ isLoading }/> }
      <AccountActionsMenu isLoading={ isLoading }/>
      <Flex ml={{ base: 0, lg: 'auto' }} columnGap={ 2 } flexGrow={{ base: 1, lg: 0 }}>
        <TokenVerifiedInfo verifiedInfoQuery={ verifiedInfoQuery }/>
        <NetworkExplorers type="token" pathParam={ addressHash } ml={{ base: 'auto', lg: 0 }}/>
      </Flex>
    </Flex>
  );

  return (
    <>
      <PageTitle
        title={ `${ tokenQuery.data?.name || 'Unnamed token' }${ tokenSymbolText }` }
        isLoading={ tokenQuery.isPlaceholderData }
        beforeTitle={ tokenQuery.data ? (
          <TokenEntity.Icon
            token={ tokenQuery.data }
            isLoading={ tokenQuery.isPlaceholderData }
            variant="heading"
            chain={ multichainContext?.chain }
          />
        ) : null }
        contentAfter={ contentAfter }
        secondRow={ secondRow }
      />
      { !addressMetadataQuery.isPending && (
        <AddressAlerts
          tags={ addressMetadataQuery.data?.addresses?.[hash.toLowerCase()]?.tags }
          isScamToken={ tokenQuery.data?.reputation === 'scam' }
        />
      ) }
    </>
  );
};

export default TokenPageTitle;
