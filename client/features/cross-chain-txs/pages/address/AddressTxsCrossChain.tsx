// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import ActionBar from 'client/shell/page/action-bar/ActionBar';

import useIsMobile from 'client/shared/hooks/useIsMobile';
import TableViewToggleButton from 'client/shared/lists/TableViewToggleButton';
import useTableViewValue from 'client/shared/lists/useTableViewValue';
import Pagination from 'client/shared/pagination/Pagination';

import TransactionsCrossChainContent from '../../components/txs/TransactionsCrossChainContent';
import type { Props } from '../../components/txs/TransactionsCrossChainContent';

const AddressCrossChainTxs = ({ pagination, isLoading: isLoadingProp, ...rest }: Props) => {
  const isMobile = useIsMobile();

  const tableViewFlag = useTableViewValue();

  const isTableView = isMobile ? !tableViewFlag.isLoading && tableViewFlag.value : true;
  const isLoading = isLoadingProp || tableViewFlag.isLoading;

  return (
    <>
      { isMobile && (
        <ActionBar>
          <TableViewToggleButton
            value={ tableViewFlag.value }
            onClick={ tableViewFlag.onToggle }
            loading={ isLoading }
          />
          { pagination?.isVisible && <Pagination { ...pagination } ml="auto"/> }
        </ActionBar>
      ) }
      <TransactionsCrossChainContent
        pagination={ pagination }
        isLoading={ isLoading }
        isTableView={ isTableView }
        stickyHeader={ !isMobile && isTableView }
        { ...rest }
      />
    </>
  );
};

export default React.memo(AddressCrossChainTxs);
