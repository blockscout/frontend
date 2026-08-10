// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex, useToken } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { schemas } from '@blockscout/api-types';
import type * as contractsInfo from '@blockscout/contracts-info-types';
import type { MetadataTag } from 'src/features/address-metadata/components/tag/types';
import { getTokenTypeName } from 'src/slices/token/utils/token-types';

import type { ResourceError } from 'src/api/resources';

import ActionsMenu from 'src/shell/page/actions-menu/ActionsMenu';
import PageTitle from 'src/shell/page/title/PageTitle';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';
import AddressAlerts from 'src/slices/address/pages/details/info/AddressAlerts';
import AddressQrCode from 'src/slices/address/pages/details/info/AddressQrCode';
import * as TokenEntity from 'src/slices/token/components/entity/TokenEntity';

import formatAccountTags from 'src/features/address-metadata/components/tag/format-account-tags';
import MetadataTags from 'src/features/address-metadata/components/tag/MetadataTags';
import sortMetadataTags from 'src/features/address-metadata/components/tag/sort';
import useAddressMetadataInfoQuery from 'src/features/address-metadata/hooks/useAddressMetadataInfoQuery';
import AlternativeExplorers from 'src/features/alternative-explorers/components/AlternativeExplorers';
import { useMultichainContext } from 'src/features/multichain/context';
import TokenVerifiedInfo from 'src/features/verified-tokens/pages/token/TokenVerifiedInfo';
import TokenAddToWallet from 'src/features/web3-wallet/components/TokenAddToWallet';

import config from 'src/config';
import SpriteIcon from 'src/sprite/SpriteIcon';

import { Link } from 'src/toolkit/chakra/link';
import { Tooltip } from 'src/toolkit/chakra/tooltip';

const PREDEFINED_TAG_PRIORITY = 100;

interface Props {
  tokenQuery: UseQueryResult<schemas['Token'], ResourceError<unknown>>;
  addressQuery: UseQueryResult<schemas['Address'], ResourceError<unknown>>;
  verifiedInfoQuery: UseQueryResult<contractsInfo.TokenInfo, ResourceError<unknown>>;
  hash: string;
}

const TokenPageTitle = ({ tokenQuery, addressQuery, verifiedInfoQuery, hash }: Props) => {
  const multichainContext = useMultichainContext();

  const addressesForMetadataQuery = React.useMemo(() => ([ hash ].filter(Boolean)), [ hash ]);
  const addressMetadataQuery = useAddressMetadataInfoQuery(addressesForMetadataQuery);

  const tokenSymbolText = tokenQuery.data?.symbol ? ` (${ tokenQuery.data.symbol })` : '';

  const [ bridgedTokenTagBgColor ] = useToken('colors', 'blue.500');
  const [ bridgedTokenTagTextColor ] = useToken('colors', 'white');

  const tags: Array<MetadataTag> = React.useMemo(() => {
    return [
      tokenQuery.data && tokenQuery.data.type ? {
        slug: tokenQuery.data.type,
        name: getTokenTypeName(tokenQuery.data.type, multichainContext?.chain?.app_config),
        tagType: 'custom' as const,
        ordinal: PREDEFINED_TAG_PRIORITY,
        meta: null,
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
      ...formatAccountTags(addressQuery.data),
      verifiedInfoQuery.data?.projectSector ?
        { slug: verifiedInfoQuery.data.projectSector, name: verifiedInfoQuery.data.projectSector, tagType: 'custom' as const, ordinal: -30, meta: null } :
        undefined,
      ...(addressMetadataQuery.data?.addresses?.[hash.toLowerCase()]?.tags.filter(tag => tag.tagType !== 'note') || []),
    ].filter(Boolean).sort(sortMetadataTags);
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

  const isTagsLoading = tokenQuery.isPlaceholderData ||
    addressQuery.isPlaceholderData ||
    (config.features.addressMetadata.isEnabled && addressMetadataQuery.isPending) ||
    (config.features.verifiedTokens.isEnabled && verifiedInfoQuery.isPending);

  const contentAfter = (
    <>
      { tokenQuery.data && <TokenEntity.Reputation value={ tokenQuery.data.reputation } ml={ 0 }/> }
      { verifiedInfoQuery.data?.tokenAddress && (
        <Tooltip
          content={ (
            <>
              Token information was added manually or sourced from an external data provider.{ ' ' }
              <Link href="https://docs.blockscout.com/using-blockscout/overviews/token-info" external className="dark">
                More details
              </Link>
            </>
          ) }
          interactive
        >
          <SpriteIcon name="certified" color="green.500" boxSize={ 6 } cursor="pointer"/>
        </Tooltip>
      ) }
      <MetadataTags
        isLoading={ isTagsLoading }
        tags={ tags }
        addressHash={ addressQuery.data?.hash }
        flexGrow={ 1 }
      />
    </>
  );

  const isMainDataLoading = tokenQuery.isPlaceholderData;
  // should not be shown before the main title text is loaded
  const isAddressDataLoading = tokenQuery.isPlaceholderData || addressQuery.isPlaceholderData;

  const secondRow = (
    <Flex alignItems="center" w="100%" minW={ 0 } columnGap={ 2 } rowGap={ 2 } flexWrap={{ base: 'wrap', lg: 'nowrap' }}>
      <AddressEntity
        address={{ ...addressQuery.data, name: '', hash: addressQuery.data?.hash || hash }}
        isLoading={ isAddressDataLoading }
        variant="subheading"
        icon={ multichainContext?.chain ? {
          shield: { name: 'pie_chart', isLoading: isAddressDataLoading },
        } : undefined }
      />
      { !isMainDataLoading && tokenQuery.data && <TokenAddToWallet token={ tokenQuery.data } variant="button"/> }
      <AddressQrCode hash={ hash } isLoading={ isMainDataLoading }/>
      <ActionsMenu isLoading={ isMainDataLoading }/>
      <Flex ml={{ base: 0, lg: 'auto' }} columnGap={ 2 } flexGrow={{ base: 1, lg: 0 }}>
        <TokenVerifiedInfo verifiedInfoQuery={ verifiedInfoQuery }/>
        <AlternativeExplorers type="token" pathParam={ hash } ml={{ base: 'auto', lg: 0 }}/>
      </Flex>
    </Flex>
  );

  return (
    <>
      <PageTitle
        title={ `${ tokenQuery.data?.name || 'Unnamed token' }${ tokenSymbolText }` }
        isLoading={ isMainDataLoading }
        beforeTitle={ tokenQuery.data ? (
          <TokenEntity.Icon
            token={ tokenQuery.data }
            isLoading={ isMainDataLoading }
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
