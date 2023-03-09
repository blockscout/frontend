import { Box, Flex, Grid, GridItem, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import type { TokenInstance } from 'types/api/token';

import parseMetadata from 'lib/token/parseMetadata';
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
import TokenInstanceTransfersCount from './details/TokenInstanceTransfersCount';

interface Props {
  data: TokenInstance;
  scrollRef?: React.RefObject<HTMLDivElement>;
}

const TokenInstanceDetails = ({ data, scrollRef }: Props) => {
  const handleCounterItemClick = React.useCallback(() => {
    window.setTimeout(() => {
      // cannot do scroll instantly, have to wait a little
      scrollRef?.current?.scrollIntoView({ behavior: 'smooth' });
    }, 500);
  }, [ scrollRef ]);

  const metadata = parseMetadata(data.metadata);
  const hasMetadata = metadata && Boolean((metadata.name || metadata.description || metadata.attributes));
  const attributeBgColor = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');

  const divider = (
    <GridItem
      colSpan={{ base: undefined, lg: 2 }}
      mt={{ base: 2, lg: 3 }}
      mb={{ base: 0, lg: 3 }}
      borderBottom="1px solid"
      borderColor="divider"
    />
  );

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
          >
            <TokenSnippet hash={ data.token.address } name={ data.token.name }/>
          </DetailsInfoItem>
          <DetailsInfoItem
            title="Owner"
            hint="Current owner of this token instance"
          >
            <Address>
              <AddressIcon address={ data.owner }/>
              <AddressLink type="address" hash={ data.owner.hash } ml={ 2 }/>
              <CopyToClipboard text={ data.owner.hash }/>
            </Address>
          </DetailsInfoItem>
          <TokenInstanceCreatorAddress hash={ data.token.address }/>
          <DetailsInfoItem
            title="Token ID"
            hint="This token instance unique token ID"
          >
            <Flex alignItems="center" overflow="hidden">
              <Box overflow="hidden" display="inline-block" w="100%">
                <HashStringShortenDynamic hash={ data.id }/>
              </Box>
              <CopyToClipboard text={ data.id } ml={ 1 }/>
            </Flex>
          </DetailsInfoItem>
          <TokenInstanceTransfersCount hash={ data.token.address } id={ data.id } onClick={ handleCounterItemClick }/>
        </Grid>
        <NftMedia
          imageUrl={ data.image_url }
          animationUrl={ data.animation_url }
          w="250px"
          flexShrink={ 0 }
          alignSelf={{ base: 'center', lg: 'flex-start' }}
        />
      </Flex>
      <Grid
        mt={ 8 }
        columnGap={ 8 }
        rowGap={{ base: 1, lg: 3 }}
        templateColumns={{ base: 'minmax(0, 1fr)', lg: '200px minmax(0, 1fr)' }}
        overflow="hidden"
      >
        { divider }
        <DetailsSponsoredItem/>
        { hasMetadata && (
          <>
            { divider }
            { metadata?.name && (
              <DetailsInfoItem
                title="Name"
                hint="NFT name"
                whiteSpace="normal"
                wordBreak="break-word"
              >
                { metadata.name }
              </DetailsInfoItem>
            ) }
            { metadata?.description && (
              <DetailsInfoItem
                title="Description"
                hint="NFT description"
                whiteSpace="normal"
                wordBreak="break-word"
              >
                { metadata.description }
              </DetailsInfoItem>
            ) }
            { metadata?.attributes && (
              <DetailsInfoItem
                title="Attributes"
                hint="NFT attributes"
                whiteSpace="normal"
              >
                <Grid gap={ 2 } templateColumns="repeat(auto-fit, minmax(160px, 1fr))" w="100%">
                  { metadata.attributes.map((attribute, index) => (
                    <GridItem
                      key={ index }
                      bgColor={ attributeBgColor }
                      borderRadius="md"
                      px={ 4 }
                      py={ 2 }
                    >
                      <Box fontSize="xs" color="text_secondary" fontWeight={ 500 }>{ attribute.trait_type }</Box>
                      <Box fontSize="sm">{ attribute.value }</Box>
                    </GridItem>
                  )) }
                </Grid>
              </DetailsInfoItem>
            ) }
          </>
        ) }
      </Grid>
    </>
  );
};

export default React.memo(TokenInstanceDetails);
