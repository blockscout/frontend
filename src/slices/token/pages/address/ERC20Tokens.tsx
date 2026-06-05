// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { PaginationParams } from 'src/shared/pagination/types';
import type { AddressTokenBalance } from 'src/slices/address/types/api';

import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'src/shell/page/action-bar/ActionBar';

import config from 'src/config';
import useIsMobile from 'src/shared/hooks/useIsMobile';
import DataList from 'src/shared/lists/DataList';
import Pagination from 'src/shared/pagination/Pagination';

import { TableContainerScrollable } from 'src/toolkit/chakra/table';

import ERC20TokensTable from './ERC20TokensTable';

type Props = {
  items: Array<Pick<AddressTokenBalance, 'token' | 'value'>> | undefined;
  isLoading: boolean;
  pagination: PaginationParams;
  isError: boolean;
  top?: number;
};

const ERC20Tokens = ({ items, isLoading, pagination, isError, top }: Props) => {
  const isMobile = useIsMobile();

  const hasAdditionalTokenTypes = config.slices.token.additionalTypes.length > 0;

  const actionBar = isMobile && pagination.isVisible && (
    <ActionBar mt={ -3 }>
      <Pagination ml="auto" { ...pagination }/>
    </ActionBar>
  );

  const content = items ? (
    <TableContainerScrollable>
      <ERC20TokensTable
        data={ items }
        top={ top ?? (pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0) }
        isLoading={ isLoading }
        hasAdditionalTokenTypes={ hasAdditionalTokenTypes }/>
    </TableContainerScrollable>
  ) : null;

  return (
    <DataList
      isError={ isError }
      itemsNum={ items?.length }
      emptyText="There are no tokens of selected type."
      actionBar={ actionBar }
    >
      { content }
    </DataList>
  );

};

export default ERC20Tokens;
