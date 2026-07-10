// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';
import NftMedia from 'src/slices/token/components/nft-media/NftMedia';
import TokenNftMarketplaces from 'src/slices/token/pages/details/info/TokenNftMarketplaces';

import AppActionButton from 'src/features/address-metadata/components/AppActionButton';
import useAppActionData from 'src/features/address-metadata/hooks/useAppActionData';

import config from 'src/config';
import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';
import DetailedInfoSponsoredItem from 'src/shared/detailed-info/DetailedInfoSponsoredItem';
import useIsMounted from 'src/shared/hooks/useIsMounted';
import CopyToClipboard from 'src/shared/texts/CopyToClipboard';
import HashStringShortenDynamic from 'src/shared/texts/HashStringShortenDynamic';

import { Skeleton } from 'src/toolkit/chakra/skeleton';

import TokenInstanceCreatorAddress from './TokenInstanceCreatorAddress';
import TokenInstanceMetadataInfo from './TokenInstanceMetadataInfo';
import TokenInstanceTransfersCount from './TokenInstanceTransfersCount';

interface Props {
  data?: schemas['TokenInstance'];
  token?: schemas['Token'];
  isLoading?: boolean;
}

const TokenInstanceDetails = ({ data, token, isLoading }: Props) => {
  const appActionData = useAppActionData(token?.address_hash, !isLoading);
  const isMounted = useIsMounted();

  if (!data || !token || !isMounted) {
    return null;
  }

  return (
    <>
      <Flex alignItems="flex-start" flexDir={{ base: 'column-reverse', lg: 'row' }} columnGap={ 6 } rowGap={ 6 }>
        <DetailedInfo.Container
          flexGrow={ 1 }
          templateColumns={{ base: 'minmax(0, 1fr)', lg: '200px minmax(500px, 1fr)' }}
        >
          { data.is_unique && data.owner && (
            <>
              <DetailedInfo.ItemLabel
                hint="Current owner of this token instance"
                isLoading={ isLoading }
              >
                Owner
              </DetailedInfo.ItemLabel>
              <DetailedInfo.ItemValue>
                <AddressEntity
                  address={ data.owner }
                  isLoading={ isLoading }
                />
              </DetailedInfo.ItemValue>
            </>
          ) }

          <TokenInstanceCreatorAddress hash={ isLoading ? '' : token.address_hash }/>

          <DetailedInfo.ItemLabel
            hint="This token instance unique token ID"
            isLoading={ isLoading }
          >
            Token ID
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <Flex alignItems="center" overflow="hidden">
              <Skeleton loading={ isLoading } overflow="hidden" display="inline-block" w="100%">
                <HashStringShortenDynamic hash={ data.id }/>
              </Skeleton>
              <CopyToClipboard text={ data.id } isLoading={ isLoading }/>
            </Flex>
          </DetailedInfo.ItemValue>

          <TokenInstanceTransfersCount hash={ isLoading ? '' : token.address_hash } id={ isLoading ? '' : data.id }/>

          <TokenNftMarketplaces
            isLoading={ isLoading }
            hash={ token.address_hash }
            id={ data.id }
            appActionData={ appActionData }
            source="NFT item"
          />

          { (config.slices.token.nft.marketplaces.length === 0 && appActionData) && (
            <>
              <DetailedInfo.ItemLabel
                hint="Link to the dapp"
              >
                Dapp
              </DetailedInfo.ItemLabel>
              <DetailedInfo.ItemValue py="1px">
                <AppActionButton data={ appActionData } height="30px" source="NFT item"/>
              </DetailedInfo.ItemValue>
            </>
          ) }
        </DetailedInfo.Container>
        <NftMedia
          data={ data }
          addressHash={ token.address_hash }
          isLoading={ isLoading }
          size="md"
          withFullscreen
          w="250px"
          flexShrink={ 0 }
          alignSelf={{ base: 'center', lg: 'flex-start' }}
        />
      </Flex>
      <DetailedInfo.Container
        mt={ 5 }
        templateColumns={{ base: 'minmax(0, 1fr)', lg: '200px minmax(500px, 1fr)' }}
      >
        <TokenInstanceMetadataInfo data={ data } isLoading={ isLoading }/>
        <DetailedInfo.ItemDivider/>
        <DetailedInfoSponsoredItem isLoading={ isLoading }/>
      </DetailedInfo.Container>
    </>
  );
};

export default React.memo(TokenInstanceDetails);
