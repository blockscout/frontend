// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, Flex, Text, Grid, HStack } from '@chakra-ui/react';
import React from 'react';

import type { NftTokenType } from 'src/slices/token/types/api';

import ActionBar from 'src/shell/page/action-bar/ActionBar';

import TokenEntity from 'src/slices/token/components/entity/TokenEntity';
import NftFallback from 'src/slices/token/components/nft-media/NftFallback';

import { useMultichainContext } from 'src/features/multichain/context';

import useIsMobile from 'src/shared/hooks/useIsMobile';
import DataList from 'src/shared/lists/DataList';
import Pagination from 'src/shared/pagination/Pagination';
import type { QueryWithPagesResult } from 'src/shared/pagination/useQueryWithPages';
import { route } from 'src/shared/router/routes';

import { Link } from 'src/toolkit/chakra/link';
import { Skeleton } from 'src/toolkit/chakra/skeleton';

import AddressNftItem from './AddressNftItem';
import AddressNftItemContainer from './AddressNftItemContainer';
import AddressNftTypeFilter from './AddressNftTypeFilter';

type Props = {
  collectionsQuery: QueryWithPagesResult<'core:address_collections'>;
  address: string;
  tokenTypes: Array<NftTokenType> | undefined;
  onTokenTypesChange: (value: Array<NftTokenType>) => void;
};

const AddressNftsCollections = ({ collectionsQuery, address, tokenTypes, onTokenTypesChange }: Props) => {
  const isMobile = useIsMobile();
  const multichainContext = useMultichainContext();

  const { isError, isPlaceholderData, data, pagination } = collectionsQuery;

  const hasActiveFilters = Boolean(tokenTypes?.length);

  const actionBar = isMobile && pagination.isVisible && (
    <ActionBar mt={ multichainContext ? -6 : -3 }>
      <AddressNftTypeFilter value={ tokenTypes } onChange={ onTokenTypesChange }/>
      <Pagination ml="auto" { ...pagination }/>
    </ActionBar>
  );

  const content = data?.items ? data?.items.filter((item) => item.token_instances.length > 0).map((item, index) => {
    const collectionUrl = route({
      pathname: '/token/[hash]',
      query: {
        hash: item.token.address_hash,
        tab: 'inventory',
        holder_address_hash: address,
      },
    }, { chain: multichainContext?.chain });
    const hasOverload = Number(item.amount) > item.token_instances.length;
    return (
      <Box key={ item.token.address_hash + index } mb={ 6 }>
        <Flex mb={ 3 } flexWrap="wrap" lineHeight="30px">
          <TokenEntity
            width="auto"
            noSymbol
            token={ item.token }
            isLoading={ isPlaceholderData }
            noCopy
            fontWeight="600"
            chain={ multichainContext?.chain }
          />
          <Skeleton loading={ isPlaceholderData } mr={ 3 }>
            <Text color="text.secondary" whiteSpace="pre">{ ` - ${ Number(item.amount).toLocaleString() } item${ Number(item.amount) > 1 ? 's' : '' }` }</Text>
          </Skeleton>
          <Link href={ collectionUrl } loading={ isPlaceholderData }>
            View in collection
          </Link>
        </Flex>
        <Grid
          w="100%"
          mb={ 6 }
          columnGap={{ base: 3, lg: 6 }}
          rowGap={{ base: 3, lg: 6 }}
          gridTemplateColumns={{ base: 'repeat(2, calc((100% - 12px)/2))', lg: 'repeat(auto-fill, minmax(210px, 1fr))' }}
        >
          { item.token_instances.map((instance, index) => {
            const key = item.token.address_hash + '_' + (instance.id && !isPlaceholderData ? `id_${ instance.id }` : `index_${ index }`);

            return (
              <AddressNftItem
                key={ key }
                instance={ instance }
                token={ item.token }
                isLoading={ isPlaceholderData }
                chain={ multichainContext?.chain }
              />
            );
          }) }
          { hasOverload && (
            <Link href={ collectionUrl }>
              <AddressNftItemContainer display="flex" alignItems="center" justifyContent="center" flexDirection="column" minH="248px">
                <HStack gap={ 2 } mb={ 3 }>
                  <NftFallback bgColor={{ _light: 'unset', _dark: 'unset' }} w="30px" h="30px" boxSize="30px" p={ 0 }/>
                  <NftFallback bgColor={{ _light: 'unset', _dark: 'unset' }} w="30px" h="30px" boxSize="30px" p={ 0 }/>
                  <NftFallback bgColor={{ _light: 'unset', _dark: 'unset' }} w="30px" h="30px" boxSize="30px" p={ 0 }/>
                </HStack>
                View all NFTs
              </AddressNftItemContainer>
            </Link>
          ) }
        </Grid>
      </Box>
    );
  }) : null;

  return (
    <DataList
      isError={ isError }
      itemsNum={ data?.items?.length }
      emptyText="There are no tokens of selected type."
      actionBar={ actionBar }
      hasActiveFilters={ hasActiveFilters }
      emptyStateProps={{
        term: 'token',
      }}
    >
      { content }
    </DataList>
  );
};

export default AddressNftsCollections;
