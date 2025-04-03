import { Flex, Grid } from '@chakra-ui/react';
import React from 'react';

import type { TokenInfo, TokenInstance } from 'types/api/token';

import config from 'configs/app';
import useIsMounted from 'lib/hooks/useIsMounted';
import { Skeleton } from 'toolkit/chakra/skeleton';
import AppActionButton from 'ui/shared/AppActionButton/AppActionButton';
import useAppActionData from 'ui/shared/AppActionButton/useAppActionData';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import DetailedInfoSponsoredItem from 'ui/shared/DetailedInfo/DetailedInfoSponsoredItem';
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

          <TokenInstanceCreatorAddress hash={ isLoading ? '' : token.address }/>

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
        </Grid>
        <NftMedia
          data={ data }
          isLoading={ isLoading }
          size="md"
          withFullscreen
          w="250px"
          flexShrink={ 0 }
          alignSelf={{ base: 'center', lg: 'flex-start' }}
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
        <DetailedInfo.ItemDivider/>
        <DetailedInfoSponsoredItem isLoading={ isLoading }/>
      </Grid>
    </>
  );
};

export default React.memo(TokenInstanceDetails);
