import { Box, Flex, Text, Grid, HStack, Skeleton } from '@chakra-ui/react';
import React from 'react';

import { route } from 'nextjs-routes';

import useIsMobile from 'lib/hooks/useIsMobile';
import { apos } from 'lib/html-entities';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';
import LinkInternal from 'ui/shared/links/LinkInternal';
import NftFallback from 'ui/shared/nft/NftFallback';
import Pagination from 'ui/shared/pagination/Pagination';
import type { QueryWithPagesResult } from 'ui/shared/pagination/useQueryWithPages';

import NFTItem from './NFTItem';
import NFTItemContainer from './NFTItemContainer';

type Props = {
  collectionsQuery: QueryWithPagesResult<'address_collections'>;
  address: string;
  hasActiveFilters: boolean;
}

const AddressCollections = ({ collectionsQuery, address, hasActiveFilters }: Props) => {
  const isMobile = useIsMobile();

  const { isError, isPlaceholderData, data, pagination } = collectionsQuery;

  const actionBar = isMobile && pagination.isVisible && (
    <ActionBar mt={ -6 }>
      <Pagination ml="auto" { ...pagination }/>
    </ActionBar>
  );

  const content = data?.items ? data?.items.filter((item) => item.token_instances.length > 0).map((item, index) => {
    const collectionUrl = route({
      pathname: '/token/[hash]',
      query: {
        hash: item.token.address,
        tab: 'inventory',
        holder_address_hash: address,
        scroll_to_tabs: 'true',
      },
    });
    const hasOverload = Number(item.amount) > item.token_instances.length;
    return (
      <Box key={ item.token.address + index } mb={ 6 }>
        <Flex mb={ 3 } flexWrap="wrap" lineHeight="30px">
          <TokenEntity
            width="auto"
            noSymbol
            token={ item.token }
            isLoading={ isPlaceholderData }
            noCopy
            fontWeight="600"
          />
          <Skeleton isLoaded={ !isPlaceholderData } mr={ 3 }>
            <Text variant="secondary" whiteSpace="pre">{ ` - ${ Number(item.amount).toLocaleString() } item${ Number(item.amount) > 1 ? 's' : '' }` }</Text>
          </Skeleton>
          <LinkInternal href={ collectionUrl } isLoading={ isPlaceholderData }>
            <Skeleton isLoaded={ !isPlaceholderData }>View in collection</Skeleton>
          </LinkInternal>
        </Flex>
        <Grid
          w="100%"
          mb={ 6 }
          columnGap={{ base: 3, lg: 6 }}
          rowGap={{ base: 3, lg: 6 }}
          gridTemplateColumns={{ base: 'repeat(2, calc((100% - 12px)/2))', lg: 'repeat(auto-fill, minmax(210px, 1fr))' }}
        >
          { item.token_instances.map((instance, index) => {
            const key = item.token.address + '_' + (instance.id && !isPlaceholderData ? `id_${ instance.id }` : `index_${ index }`);

            return (
              <NFTItem
                key={ key }
                { ...instance }
                token={ item.token }
                isLoading={ isPlaceholderData }
              />
            );
          }) }
          { hasOverload && (
            <LinkInternal display="flex" href={ collectionUrl }>
              <NFTItemContainer display="flex" alignItems="center" justifyContent="center" flexDirection="column" minH="248px">
                <HStack gap={ 2 } mb={ 3 }>
                  <NftFallback bgColor="unset" w="30px" h="30px" boxSize="30px" p={ 0 }/>
                  <NftFallback bgColor="unset" w="30px" h="30px" boxSize="30px" p={ 0 }/>
                  <NftFallback bgColor="unset" w="30px" h="30px" boxSize="30px" p={ 0 }/>
                </HStack>
                View all NFTs
              </NFTItemContainer>
            </LinkInternal>
          ) }
        </Grid>
      </Box>
    );
  }) : null;

  return (
    <DataListDisplay
      isError={ isError }
      items={ data?.items }
      emptyText="There are no tokens of selected type."
      content={ content }
      actionBar={ actionBar }
      filterProps={{
        emptyFilteredText: `Couldn${ apos }t find any token that matches your query.`,
        hasActiveFilters,
      }}
    />
  );
};

export default AddressCollections;
