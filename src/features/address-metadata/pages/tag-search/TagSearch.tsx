// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, chakra, Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { MetadataTag as TMetadataTag, MetadataTagType } from '../../components/tag/types';

import { ACTION_BAR_HEIGHT_DESKTOP } from 'src/shell/page/action-bar/ActionBar';
import PageTitle from 'src/shell/page/title/PageTitle';

import { TOP_ADDRESS } from 'src/slices/address/stubs/address';

import DataList from 'src/shared/lists/DataList';
import StickyPaginationWithText from 'src/shared/pagination/StickyPaginationWithText';
import useApiPaginatedQuery from 'src/shared/pagination/useApiPaginatedQuery';
import { generateListStub } from 'src/shared/pagination/utils';
import getQueryParamString from 'src/shared/router/get-query-param-string';

import { Skeleton } from 'src/toolkit/chakra/skeleton';

import MetadataTag from '../../components/tag/MetadataTag';
import TagSearchListItem from './TagSearchListItem';
import TagSearchTable from './TagSearchTable';

const TagSearch = () => {

  const router = useRouter();
  const slug = getQueryParamString(router.query.slug);
  const tagType = getQueryParamString(router.query.tagType);
  const tagName = getQueryParamString(router.query.tagName);

  const { isError, isInitialLoading, isTransitioning, data, pagination } = useApiPaginatedQuery({
    resourceName: 'core:addresses_metadata_search',
    queryParams: {
      slug,
      tag_type: tagType,
    },
    options: {
      placeholderData: generateListStub<'core:addresses_metadata_search'>(
        TOP_ADDRESS,
        50,
        {
          next_page_params: null,
        },
      ),
    },
  });

  const content = data?.items ? (
    <>
      <Box hideBelow="lg">
        <TagSearchTable
          top={ pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 }
          items={ data.items }
          isLoading={ isInitialLoading }
        />
      </Box>
      <Box hideFrom="lg">
        { data.items.map((item, index) => {
          return (
            <TagSearchListItem
              key={ item.hash + (isInitialLoading ? index : '') }
              item={ item }
              isLoading={ isInitialLoading }
            />
          );
        }) }
      </Box>
    </>
  ) : null;

  const text = (() => {
    if (isError) {
      return null;
    }

    const num = data?.items.length || 0;

    const tagData: TMetadataTag = {
      tagType: tagType as MetadataTagType,
      slug,
      name: tagName || slug,
      ordinal: 0,
    };

    return (
      <Flex alignItems="center" columnGap={ 2 } flexWrap="wrap" rowGap={ 1 }>
        <Skeleton loading={ isInitialLoading } display="inline-block">
          Found{ ' ' }
          <chakra.span fontWeight={ 700 }>
            { num }{ data?.next_page_params || pagination.page > 1 ? '+' : '' }
          </chakra.span>{ ' ' }
          matching result{ num > 1 ? 's' : '' } for
        </Skeleton>
        <MetadataTag data={ tagData } isLoading={ isInitialLoading } noLink/>
      </Flex>
    );
  })();

  const actionBar = <StickyPaginationWithText text={ text } pagination={ pagination }/>;

  return (
    <>
      <PageTitle title="Search result" withTextAd/>
      <DataList
        isError={ isError }
        itemsNum={ data?.items.length }
        emptyText={ text }
        actionBar={ actionBar }
        isTransitioning={ isTransitioning }
      >
        { content }
      </DataList>
    </>
  );
};

export default TagSearch;
