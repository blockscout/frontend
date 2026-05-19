import { Box, Text, VStack } from '@chakra-ui/react';
import React from 'react';

import type { PublicTagApplicationRow } from 'types/api/publicTagSubmissions';

import appConfig from 'configs/app';
import { PUBLIC_TAG_APPLICATION_ROW } from 'stubs/publicTagSubmissions';
import { generateListStub } from 'stubs/utils';
import { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import StickyPaginationWithText from 'ui/shared/StickyPaginationWithText';

import PublicTagApplicationEditModal from './PublicTagApplicationEditModal';
import PublicTagApplicationsListItem from './PublicTagApplicationsListItem';
import PublicTagApplicationsStatusFilter from './PublicTagApplicationsStatusFilter';
import PublicTagApplicationsTable from './PublicTagApplicationsTable';

const PublicTagApplicationsList = () => {
  const [ editItem, setEditItem ] = React.useState<PublicTagApplicationRow | null>(null);
  const [ statusFilter, setStatusFilter ] = React.useState<string | undefined>(undefined);

  const { data, isError, isPlaceholderData, pagination, onFilterChange } = useQueryWithPages({
    resourceName: 'admin:public_tag_applications_list',
    pathParams: { chainId: appConfig.chain.id },
    filters: statusFilter ? { status: statusFilter as 'pending' | 'approved' | 'rejected' } : undefined,
    options: {
      placeholderData: generateListStub<'admin:public_tag_applications_list'>(
        PUBLIC_TAG_APPLICATION_ROW,
        5,
        { next_page_params: null },
      ),
    },
  });

  const handleStatusChange = React.useCallback((status: string | undefined) => {
    setStatusFilter(status);
    onFilterChange({ status: status as 'pending' | 'approved' | 'rejected' | undefined });
  }, [ onFilterChange ]);

  const handleEdit = React.useCallback((item: PublicTagApplicationRow) => {
    setEditItem(item);
  }, []);

  const handleEditModalClose = React.useCallback(() => {
    setEditItem(null);
  }, []);

  const handleEditOpenChange = React.useCallback(({ open }: { open: boolean }) => {
    if (!open) {
      handleEditModalClose();
    }
  }, [ handleEditModalClose ]);

  const content = data?.items ? (
    <>
      <Box hideFrom="lg">
        { data.items.map((item, index) => (
          <PublicTagApplicationsListItem
            key={ String(item.id) + (isPlaceholderData ? index : '') }
            item={ item }
            isLoading={ isPlaceholderData }
            onEdit={ handleEdit }
          />
        )) }
      </Box>
      <Box hideBelow="lg">
        <PublicTagApplicationsTable
          items={ data.items }
          top={ pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 }
          isLoading={ isPlaceholderData }
          onEdit={ handleEdit }
        />
      </Box>
    </>
  ) : null;

  const filterElement = (
    <PublicTagApplicationsStatusFilter
      value={ statusFilter }
      onChange={ handleStatusChange }
    />
  );

  const actionBar = (
    <StickyPaginationWithText
      text={ filterElement }
      pagination={ pagination }
    />
  );

  return (
    <>
      <DataListDisplay
        isError={ isError }
        itemsNum={ data?.items.length }
        emptyText=""
        actionBar={ actionBar }
      >
        { content }
      </DataListDisplay>
      { isError !== true && data?.items.length === 0 && (
        <VStack mt={ 8 } gap={ 2 }>
          <Text color="text.secondary" textAlign="center">
            No requests yet — submit one from the <strong>Submit new tag</strong> tab.
          </Text>
        </VStack>
      ) }
      { editItem && (
        <PublicTagApplicationEditModal
          item={ editItem }
          open={ Boolean(editItem) }
          onOpenChange={ handleEditOpenChange }
        />
      ) }
    </>
  );
};

export default PublicTagApplicationsList;
