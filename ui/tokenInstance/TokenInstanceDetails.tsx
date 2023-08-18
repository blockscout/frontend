import { Flex, Grid, Skeleton } from '@chakra-ui/react';
import React from 'react';

import type { TokenInstance } from 'types/api/token';

import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import DetailsSponsoredItem from 'ui/shared/DetailsSponsoredItem';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import NftMedia from 'ui/shared/nft/NftMedia';
import TokenSnippet from 'ui/shared/TokenSnippet/TokenSnippet';

import TokenInstanceCreatorAddress from './details/TokenInstanceCreatorAddress';
import TokenInstanceDivider from './details/TokenInstanceDivider';
import TokenInstanceMetadataInfo from './details/TokenInstanceMetadataInfo';
import TokenInstanceTransfersCount from './details/TokenInstanceTransfersCount';

interface Props {
  data?: TokenInstance;
  isLoading?: boolean;
  scrollRef?: React.RefObject<HTMLDivElement>;
}

const TokenInstanceDetails = ({ data, scrollRef, isLoading }: Props) => {
  const handleCounterItemClick = React.useCallback(() => {
    window.setTimeout(() => {
      // cannot do scroll instantly, have to wait a little
      scrollRef?.current?.scrollIntoView({ behavior: 'smooth' });
    }, 500);
  }, [ scrollRef ]);

  if (!data) {
    return null;
  }

  return (
    <>
      <Flex alignItems="flex-start" mt={ 8 } flexDir={{ base: 'column-reverse', lg: 'row' }} columnGap={ 6 } rowGap={ 6 }>
        <Grid
          flexGrow={ 1 }
          columnGap={ 8 }
          rowGap={{ base: 1, lg: 3 }}
          templateColumns={{ base: 'minmax(0, 1fr)', lg: '200px minmax(0, 1fr)' }}
          overflow="hidden"
        >
          <DetailsInfoItem
            title="Token"
            hint="Token name"
            isLoading={ isLoading }
          >
            <TokenSnippet data={ data.token } isLoading={ isLoading }/>
          </DetailsInfoItem>
          { data.is_unique && data.owner && (
            <DetailsInfoItem
              title="Owner"
              hint="Current owner of this token instance"
              isLoading={ isLoading }
            >
              <Address>
                <AddressIcon address={ data.owner } isLoading={ isLoading }/>
                <AddressLink type="address" hash={ data.owner.hash } ml={ 2 } isLoading={ isLoading }/>
                <CopyToClipboard text={ data.owner.hash } isLoading={ isLoading }/>
              </Address>
            </DetailsInfoItem>
          ) }
          <TokenInstanceCreatorAddress hash={ isLoading ? '' : data.token.address }/>
          <DetailsInfoItem
            title="Token ID"
            hint="This token instance unique token ID"
            isLoading={ isLoading }
          >
            <Flex alignItems="center" overflow="hidden">
              <Skeleton isLoaded={ !isLoading } overflow="hidden" display="inline-block" w="100%">
                <HashStringShortenDynamic hash={ data.id }/>
              </Skeleton>
              <CopyToClipboard text={ data.id } isLoading={ isLoading }/>
            </Flex>
          </DetailsInfoItem>
          <TokenInstanceTransfersCount hash={ isLoading ? '' : data.token.address } id={ isLoading ? '' : data.id } onClick={ handleCounterItemClick }/>
        </Grid>
        <NftMedia
          url={ data.animation_url || data.image_url }
          w="250px"
          flexShrink={ 0 }
          alignSelf={{ base: 'center', lg: 'flex-start' }}
          isLoading={ isLoading }
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
        <TokenInstanceDivider/>
        <DetailsSponsoredItem isLoading={ isLoading }/>
      </Grid>
    </>
  );
};

export default React.memo(TokenInstanceDetails);
