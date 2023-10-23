import { Grid, GridItem, Skeleton, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import type { TokenInstance } from 'types/api/token';
import type { MetadataAttributes } from 'types/client/token';

import parseMetadata from 'lib/token/parseMetadata';
import DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import DetailsInfoItemDivider from 'ui/shared/DetailsInfoItemDivider';
import LinkExternal from 'ui/shared/LinkExternal';
import TruncatedValue from 'ui/shared/TruncatedValue';

interface Props {
  data?: TokenInstance;
  isLoading?: boolean;
}

interface ItemProps {
  data: MetadataAttributes;
  isLoading?: boolean;
}

const Item = ({ data, isLoading }: ItemProps) => {
  const attributeBgColor = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');

  const value = (() => {
    if (data.value_type === 'URL') {
      return (
        <LinkExternal
          whiteSpace="nowrap"
          display="inline-flex"
          alignItems="center"
          w="100%"
          overflow="hidden"
          href={ data.value }
          fontSize="sm"
          lineHeight={ 5 }
        >
          <TruncatedValue value={ data.value } w="calc(100% - 16px)"/>
        </LinkExternal>
      );
    }

    return <TruncatedValue value={ data.value } fontSize="sm" w="100%" isLoading={ isLoading }/>;
  })();

  return (
    <GridItem
      bgColor={ attributeBgColor }
      borderRadius="md"
      px={ 4 }
      py={ 2 }
      display="flex"
      flexDir="column"
      alignItems="flex-start"
    >
      <Skeleton isLoaded={ !isLoading } fontSize="xs" lineHeight={ 4 } color="text_secondary" fontWeight={ 500 } mb={ 1 }>
        <span>{ data.trait_type }</span>
      </Skeleton>
      { value }
    </GridItem>
  );
};

const TokenInstanceMetadataInfo = ({ data, isLoading }: Props) => {
  const metadata = React.useMemo(() => parseMetadata(data?.metadata), [ data ]);
  const hasMetadata = metadata && Boolean((metadata.name || metadata.description || metadata.attributes));

  if (!hasMetadata) {
    return null;
  }

  return (
    <>
      <DetailsInfoItemDivider/>
      { metadata?.name && (
        <DetailsInfoItem
          title="Name"
          hint="NFT name"
          whiteSpace="normal"
          wordBreak="break-word"
          isLoading={ isLoading }
        >
          <Skeleton isLoaded={ !isLoading }>
            { metadata.name }
          </Skeleton>
        </DetailsInfoItem>
      ) }
      { metadata?.description && (
        <DetailsInfoItem
          title="Description"
          hint="NFT description"
          whiteSpace="normal"
          wordBreak="break-word"
          isLoading={ isLoading }
        >
          <Skeleton isLoaded={ !isLoading }>
            { metadata.description }
          </Skeleton>
        </DetailsInfoItem>
      ) }
      { metadata?.attributes && (
        <DetailsInfoItem
          title="Attributes"
          hint="NFT attributes"
          whiteSpace="normal"
          isLoading={ isLoading }
        >
          <Grid gap={ 2 } templateColumns="repeat(auto-fill,minmax(160px, 1fr))" w="100%">
            { metadata.attributes.map((attribute, index) => <Item key={ index } data={ attribute } isLoading={ isLoading }/>) }
          </Grid>
        </DetailsInfoItem>
      ) }
    </>
  );
};

export default React.memo(TokenInstanceMetadataInfo);
