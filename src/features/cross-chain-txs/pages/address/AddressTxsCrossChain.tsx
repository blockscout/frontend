// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import ActionBar from 'src/shell/page/action-bar/ActionBar';

import useIsMobile from 'src/shared/hooks/useIsMobile';
import Pagination from 'src/shared/pagination/Pagination';

import TransactionsCrossChainContent from '../../components/txs/TransactionsCrossChainContent';
import type { Props } from '../../components/txs/TransactionsCrossChainContent';

const AddressCrossChainTxs = ({ pagination, isLoading, ...rest }: Props) => {
  const isMobile = useIsMobile();

  return (
    <>
      { isMobile && (
        <ActionBar>
          { pagination?.isVisible && <Pagination { ...pagination } ml="auto"/> }
        </ActionBar>
      ) }
      <TransactionsCrossChainContent
        pagination={ pagination }
        isLoading={ isLoading }
        isTableView
        stickyHeader={ !isMobile }
        { ...rest }
      />
    </>
  );
};

export default React.memo(AddressCrossChainTxs);
