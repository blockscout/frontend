// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { PaginationParams } from 'client/shared/pagination/types';
import type { AddressTokenBalance } from 'client/slices/address/types/api';

import useIsMobile from 'client/shared/hooks/useIsMobile';
import DataList from 'client/shared/lists/DataList';
import Pagination from 'client/shared/pagination/Pagination';

import config from 'configs/app';
import ActionBar from 'ui/shared/ActionBar';

import ERC20TokensListItem from './ERC20TokensListItem';
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

  const hasAdditionalTokenTypes = config.chain.additionalTokenTypes.length > 0;

  const actionBar = isMobile && pagination.isVisible && (
    <ActionBar mt={ -6 }>
      <Pagination ml="auto" { ...pagination }/>
    </ActionBar>
  );

  const content = items ? (
    <>
      <Box hideBelow="lg">
        <ERC20TokensTable
          data={ items }
          top={ top ?? (pagination.isVisible ? 72 : 0) }
          isLoading={ isLoading }
          hasAdditionalTokenTypes={ hasAdditionalTokenTypes }/>
      </Box>
      <Box hideFrom="lg">{ items.map((item, index) => (
        <ERC20TokensListItem
          key={ item.token.address_hash + (isLoading ? index : '') }
          { ...item }
          isLoading={ isLoading }
          hasAdditionalTokenTypes={ hasAdditionalTokenTypes }
        />
      )) }
      </Box>
    </>
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
