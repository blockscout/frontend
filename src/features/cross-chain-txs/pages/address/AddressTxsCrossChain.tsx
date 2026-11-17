// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import ActionBar from 'src/shell/page/action-bar/ActionBar';

import useIsMobile from 'src/shared/hooks/useIsMobile';
import Pagination from 'src/shared/pagination/Pagination';

import TransactionsCrossChainContent from '../../components/txs/TransactionsCrossChainContent';
import type { Props } from '../../components/txs/TransactionsCrossChainContent';

const AddressTxsCrossChain = ({ pagination, isLoading, ...rest }: Props) => {
  const isMobile = useIsMobile();

  const actionBar = isMobile && pagination?.isVisible && (
    <ActionBar>
      <Pagination { ...pagination } ml="auto"/>
    </ActionBar>
  );

  return (
    <TransactionsCrossChainContent
      pagination={ pagination }
      isLoading={ isLoading }
      stickyHeader={ !isMobile }
      actionBar={ actionBar }
      { ...rest }
    />
  );
};

export default React.memo(AddressTxsCrossChain);
