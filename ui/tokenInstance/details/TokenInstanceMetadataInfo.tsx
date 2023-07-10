import { Box, Grid, GridItem, Icon, Link, Skeleton, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import type { TokenInstance } from 'types/api/token';
import type { MetadataAttributes } from 'types/client/token';

import arrowIcon from 'icons/arrows/north-east.svg';
import parseMetadata from 'lib/token/parseMetadata';
import DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import TruncatedTextTooltip from 'ui/shared/TruncatedTextTooltip';

import TokenInstanceDivider from './TokenInstanceDivider';

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
        <Link whiteSpace="nowrap" display="flex" alignItems="center" w="100%" overflow="hidden" fontSize="sm">
          <TruncatedTextTooltip label={ data.value }>
            <Box w="calc(100% - 16px)" overflow="hidden" textOverflow="ellipsis">
              <span>{ data.value }</span>
            </Box>
          </TruncatedTextTooltip>
          <Icon as={ arrowIcon } boxSize={ 4 }/>
        </Link>
      );
    }

    return (
      <TruncatedTextTooltip label={ data.value }>
        <Skeleton isLoaded={ !isLoading } fontSize="sm" w="100%" overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis">
          { data.value }
        </Skeleton>
      </TruncatedTextTooltip>
    );
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
      <TokenInstanceDivider/>
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
