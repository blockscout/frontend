// SPDX-License-Identifier: LicenseRef-Blockscout

import { Grid } from '@chakra-ui/react';
import React from 'react';

import type { NftTokenType } from 'src/slices/token/types/api';

import { useMultichainContext } from 'src/features/multichain/context';

import DataList from 'src/shared/lists/DataList';
import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';
import type { ApiPaginatedQueryResult } from 'src/shared/pagination/useApiPaginatedQuery';

import AddressNftItem from './AddressNftItem';
import type { NftDisplayTypeSwitch } from './AddressNftsActionBar';
import AddressNftsActionBar from './AddressNftsActionBar';

// grid layout (not a table), so the initial window is larger than the default
const INITIAL_RENDERED_ITEMS_NUM = 30;

type Props = {
  tokensQuery: ApiPaginatedQueryResult<'core:address_nfts'>;
  tokenTypes: Array<NftTokenType> | undefined;
  onTokenTypesChange: (value: Array<NftTokenType>) => void;
  displayTypeSwitch?: NftDisplayTypeSwitch;
};

const AddressNfts = ({ tokensQuery, tokenTypes, onTokenTypesChange, displayTypeSwitch }: Props) => {
  const multichainContext = useMultichainContext();

  const { isError, isInitialLoading, isTransitioning, data, pagination } = tokensQuery;

  const { cutRef, renderedItemsNum } = useLazyRenderedList({
    list: data?.items,
    isEnabled: !isInitialLoading,
    minItemsNum: INITIAL_RENDERED_ITEMS_NUM,
    resetKey: tokensQuery.queryHash,
  });

  const hasActiveFilters = Boolean(tokenTypes?.length);

  const actionBar = (
    <AddressNftsActionBar
      tokenTypes={ tokenTypes }
      onTokenTypesChange={ onTokenTypesChange }
      pagination={ pagination }
      displayTypeSwitch={ displayTypeSwitch }
    />
  );

  const content = data?.items ? (
    <>
      <Grid
        w="100%"
        columnGap={{ base: 3, lg: 6 }}
        rowGap={{ base: 3, lg: 6 }}
        gridTemplateColumns={{ base: 'repeat(2, calc((100% - 12px)/2))', lg: 'repeat(auto-fill, minmax(210px, 1fr))' }}
      >
        { data.items.slice(0, renderedItemsNum).map((item, index) => {
          const key = item.token?.address_hash + '_' + (item.id && !isInitialLoading ? `id_${ item.id }` : `index_${ index }`);

          return (
            <AddressNftItem
              key={ key }
              instance={ item }
              token={ item.token ?? undefined }
              isLoading={ isInitialLoading }
              withTokenLink
              chain={ multichainContext?.chain }
            />
          );
        }) }
      </Grid>
      <div ref={ cutRef }/>
    </>
  ) : null;

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
      isTransitioning={ isTransitioning }
    >
      { content }
    </DataList>
  );
};

export default AddressNfts;
