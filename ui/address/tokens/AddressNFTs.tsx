import { Grid } from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import React from 'react';

import useIsMobile from 'lib/hooks/useIsMobile';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import Pagination from 'ui/shared/pagination/Pagination';
import type { QueryWithPagesResult } from 'ui/shared/pagination/useQueryWithPages';

import NFTItem from './NFTItem';

type Props = {
  tokensQuery: QueryWithPagesResult<'address_nfts'>;
  hasActiveFilters: boolean;
}

const AddressNFTs = ({ tokensQuery, hasActiveFilters }: Props) => {
  const { t } = useTranslation('common');

  const isMobile = useIsMobile();

  const { isError, isPlaceholderData, data, pagination } = tokensQuery;

  const actionBar = isMobile && pagination.isVisible && (
    <ActionBar mt={ -6 }>
      <Pagination ml="auto" { ...pagination }/>
    </ActionBar>
  );

  const content = data?.items ? (
    <Grid
      w="100%"
      columnGap={{ base: 3, lg: 6 }}
      rowGap={{ base: 3, lg: 6 }}
      gridTemplateColumns={{ base: 'repeat(2, calc((100% - 12px)/2))', lg: 'repeat(auto-fill, minmax(210px, 1fr))' }}
    >
      { data.items.map((item, index) => {
        const key = item.token.address + '_' + (item.id && !isPlaceholderData ? `id_${ item.id }` : `index_${ index }`);

        return (
          <NFTItem
            key={ key }
            { ...item }
            isLoading={ isPlaceholderData }
            withTokenLink
          />
        );
      }) }
    </Grid>
  ) : null;

  return (
    <DataListDisplay
      isError={ isError }
      items={ data?.items }
      emptyText={ t('address_area.There_are_no_tokens_of_selected_type') }
      content={ content }
      actionBar={ actionBar }
      filterProps={{
        emptyFilteredText: t('address_area.Couldnt_find_any_token_that_matches_your_query'),
        hasActiveFilters,
      }}
    />
  );
};

export default AddressNFTs;
