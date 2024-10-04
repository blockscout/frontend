import { Flex, Grid, Skeleton } from '@chakra-ui/react';
import React from 'react';

import type { TokenInfo, TokenInstance } from 'types/api/token';

import config from 'configs/app';
import useIsMounted from 'lib/hooks/useIsMounted';
import AppActionButton from 'ui/shared/AppActionButton/AppActionButton';
import useAppActionData from 'ui/shared/AppActionButton/useAppActionData';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import * as DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import DetailsInfoItemDivider from 'ui/shared/DetailsInfoItemDivider';
import DetailsSponsoredItem from 'ui/shared/DetailsSponsoredItem';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import NftMedia from 'ui/shared/nft/NftMedia';
import TokenNftMarketplaces from 'ui/token/TokenNftMarketplaces';

import TokenInstanceCreatorAddress from './details/TokenInstanceCreatorAddress';
import TokenInstanceMetadataInfo from './details/TokenInstanceMetadataInfo';
import TokenInstanceTransfersCount from './details/TokenInstanceTransfersCount';

interface Props {
  data?: TokenInstance;
  token?: TokenInfo;
  isLoading?: boolean;
  scrollRef?: React.RefObject<HTMLDivElement>;
}

const TokenInstanceDetails = ({ data, token, scrollRef, isLoading }: Props) => {
  const appActionData = useAppActionData(token?.address, !isLoading);
  const isMounted = useIsMounted();

  const handleCounterItemClick = React.useCallback(() => {
    window.setTimeout(() => {
      // cannot do scroll instantly, have to wait a little
      scrollRef?.current?.scrollIntoView({ behavior: 'smooth' });
    }, 500);
  }, [ scrollRef ]);

  if (!data || !token || !isMounted) {
    return null;
  }

  return (
    <>
      <Flex alignItems="flex-start" flexDir={{ base: 'column-reverse', lg: 'row' }} columnGap={ 6 } rowGap={ 6 }>
        <Grid
          flexGrow={ 1 }
          columnGap={ 8 }
          rowGap={{ base: 1, lg: 3 }}
          templateColumns={{ base: 'minmax(0, 1fr)', lg: '200px minmax(0, 1fr)' }}
          overflow="hidden"
        >
          { data.is_unique && data.owner && (
            <>
              <DetailsInfoItem.Label
                hint="Current owner of this token instance"
                isLoading={ isLoading }
              >
                Owner
              </DetailsInfoItem.Label>
              <DetailsInfoItem.Value>
                <AddressEntity
                  address={ data.owner }
                  isLoading={ isLoading }
                />
              </DetailsInfoItem.Value>
            </>
          ) }

          <TokenInstanceCreatorAddress hash={ isLoading ? '' : token.address }/>

          <DetailsInfoItem.Label
            hint="This token instance unique token ID"
            isLoading={ isLoading }
          >
            Token ID
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            <Flex alignItems="center" overflow="hidden">
              <Skeleton isLoaded={ !isLoading } overflow="hidden" display="inline-block" w="100%">
                <HashStringShortenDynamic hash={ data.id }/>
              </Skeleton>
              <CopyToClipboard text={ data.id } isLoading={ isLoading }/>
            </Flex>
          </DetailsInfoItem.Value>

          <TokenInstanceTransfersCount hash={ isLoading ? '' : token.address } id={ isLoading ? '' : data.id } onClick={ handleCounterItemClick }/>

          <TokenNftMarketplaces
            isLoading={ isLoading }
            hash={ token.address }
            id={ data.id }
            appActionData={ appActionData }
            source="NFT item"
          />

          { (config.UI.views.nft.marketplaces.length === 0 && appActionData) && (
            <>
              <DetailsInfoItem.Label
                hint="Link to the dapp"
              >
                Dapp
              </DetailsInfoItem.Label>
              <DetailsInfoItem.Value py="1px">
                <AppActionButton data={ appActionData } height="30px" source="NFT item"/>
              </DetailsInfoItem.Value>
            </>
          ) }
        </Grid>
        <NftMedia
          animationUrl={ data.animation_url }
          imageUrl={ data.image_url }
          w="250px"
          flexShrink={ 0 }
          alignSelf={{ base: 'center', lg: 'flex-start' }}
          isLoading={ isLoading }
          withFullscreen
        />
      </Flex>
      <Grid
        mt={ 5 }
        columnGap={ 8 }
        rowGap={{ base: 1, lg: 3 }}
        templateColumns={{ base: 'minmax(0, 1fr)', lg: '200px minmax(0, 1fr)' }}
        overflow="hidden"
      >
        <TokenInstanceMetadataInfo data={ data } isLoading={ isLoading }/>
        <DetailsInfoItemDivider/>
        <DetailsSponsoredItem isLoading={ isLoading }/>
      </Grid>
    </>
  );
};

export default React.memo(TokenInstanceDetails);
