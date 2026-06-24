// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, Flex } from '@chakra-ui/react';
import type React from 'react';

import type { AllowanceType } from '../types';
import type { EssentialDappsChainConfig } from 'src/features/marketplace/types/client';
import type { PaginationParams } from 'src/shared/pagination/types';

import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'src/shell/page/action-bar/ActionBar';

import DataList from 'src/shared/lists/DataList';
import Pagination from 'src/shared/pagination/Pagination';

import { APPROVALS_STICKY_SUMMARY_HEIGHT } from '../constants';
import ApprovalsListItem from './ApprovalsListItem';
import ApprovalsTable from './ApprovalsTable';

type Props = {
  selectedChain: EssentialDappsChainConfig | undefined;
  approvals: Array<AllowanceType>;
  isLoading?: boolean;
  isError?: boolean;
  isAddressMatch?: boolean;
  hideApproval: (approval: AllowanceType) => void;
  pagination: PaginationParams;
  actionBarRef?: React.RefObject<HTMLDivElement | null>;
};

export default function Approvals({
  selectedChain,
  approvals,
  isLoading,
  isError,
  isAddressMatch,
  hideApproval,
  pagination,
  actionBarRef,
}: Props) {
  const tableHeaderTop = APPROVALS_STICKY_SUMMARY_HEIGHT + ACTION_BAR_HEIGHT_DESKTOP;

  const actionBar = pagination.isVisible ? (
    <>
      <Box ref={ actionBarRef }/>
      <ActionBar
        mt={ 0 }
        top={{ base: 0, lg: `${ APPROVALS_STICKY_SUMMARY_HEIGHT }px` }}
      >
        <Pagination ml="auto" { ...pagination }/>
      </ActionBar>
    </>
  ) : null;

  const content = (
    <>
      <Flex hideFrom="lg" flexDirection="column">
        { approvals.map((approval, index) => (
          <ApprovalsListItem
            key={ index }
            selectedChain={ selectedChain }
            approval={ approval }
            isLoading={ isLoading }
            isAddressMatch={ isAddressMatch }
            hideApproval={ hideApproval }
          />
        )) }
      </Flex>
      <Box hideBelow="lg">
        <ApprovalsTable
          selectedChain={ selectedChain }
          approvals={ approvals }
          isLoading={ isLoading }
          isAddressMatch={ isAddressMatch }
          hideApproval={ hideApproval }
          tableHeaderTop={ tableHeaderTop }
        />
      </Box>
    </>
  );

  return (
    <DataList
      itemsNum={ approvals.length }
      isError={ Boolean(isError) }
      mt={ isError ? 5 : 0 }
      hasActiveFilters
      actionBar={ actionBar }
      showActionBarIfEmpty
      showActionBarIfError
      emptyStateProps={{
        term: 'approval',
      }}
    >
      { content }
    </DataList>
  );
}
