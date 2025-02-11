import { Grid, GridItem, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import type { TokenInstance } from 'types/api/token';
import type { MetadataAttributes } from 'types/client/token';

import parseMetadata from 'lib/token/parseMetadata';
import Skeleton from 'ui/shared/chakra/Skeleton';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';

import LinkExternal from 'ui/shared/links/LinkExternal';
import TruncatedValue from 'ui/shared/TruncatedValue';

import { useMetadataUpdateContext } from '../contexts/metadataUpdate';

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
          isLoading={ isLoading }
        >
          <TruncatedValue value={ data.value } w="calc(100% - 16px)" isLoading={ isLoading }/>
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
      <TruncatedValue
        value={ data.trait_type }
        fontSize="xs"
        w="100%"
        lineHeight={ 4 }
        color="text_secondary"
        fontWeight={ 500 }
        mb={ 1 }
        isLoading={ isLoading }
      />
      { value }
    </GridItem>
  );
};

const TokenInstanceMetadataInfo = ({ data, isLoading: isLoadingProp }: Props) => {
  const { status: refetchStatus } = useMetadataUpdateContext() || {};

  const metadata = React.useMemo(() => parseMetadata(data?.metadata), [ data ]);

  const hasMetadata = metadata && Boolean((metadata.name || metadata.description || metadata.attributes));
  if (!hasMetadata) {
    return null;
  }

  const isLoading = isLoadingProp || refetchStatus === 'WAITING_FOR_RESPONSE';

  return (
    <>
      <DetailedInfo.ItemDivider/>
      { metadata?.name && (
        <>
          <DetailedInfo.ItemLabel
            hint="NFT name"
            isLoading={ isLoading }
          >
            Name
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue
            whiteSpace="normal"
            wordBreak="break-word"
          >
            <Skeleton isLoaded={ !isLoading }>
              { metadata.name }
            </Skeleton>
          </DetailedInfo.ItemValue>
        </>
      ) }
      { metadata?.description && (
        <>
          <DetailedInfo.ItemLabel
            hint="NFT description"
            isLoading={ isLoading }
          >
            Description
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue
            whiteSpace="normal"
            wordBreak="break-word"
          >
            <Skeleton isLoaded={ !isLoading }>
              { metadata.description }
            </Skeleton>
          </DetailedInfo.ItemValue>
        </>
      ) }
      { metadata?.attributes && metadata.attributes.length > 0 && (
        <>
          <DetailedInfo.ItemLabel
            hint="NFT attributes"
            isLoading={ isLoading }
          >
            Attributes
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <Grid gap={ 2 } templateColumns="repeat(auto-fill,minmax(160px, 1fr))" w="100%" whiteSpace="normal">
              { metadata.attributes
                .filter((attribute) => attribute.value)
                .map((attribute, index) => <Item key={ index } data={ attribute } isLoading={ isLoading }/>) }
            </Grid>
          </DetailedInfo.ItemValue>
        </>
      ) }
    </>
  );
};

export default React.memo(TokenInstanceMetadataInfo);
