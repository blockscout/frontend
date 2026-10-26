// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { InterchainMessage } from '@blockscout/interchain-indexer-types';
import type { CrossChainFilters } from 'src/features/cross-chain-txs/types/api';

import { AddressHighlightProvider } from 'src/slices/address/contexts/address-highlight';

import TimeFormatToggle from 'src/shared/date-and-time/TimeFormatToggle';
import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

import { TableBody, TableColumnHeader, TableHeader, TableHeaderSticky, TableRoot, TableRow } from 'src/toolkit/chakra/table';

import type { CrossChainFilterColumn } from '../filters/CrossChainFilterByColumn';
import CrossChainFilterByColumn from '../filters/CrossChainFilterByColumn';
import type { CrossChainFilterChangeHandler } from '../filters/utils';
import TransactionsCrossChainTableItem from './TransactionsCrossChainTableItem';

interface Props {
  data: Array<InterchainMessage>;
  isLoading?: boolean;
  top?: number;
  stickyHeader?: boolean;
  currentAddress?: string;
  resetKey?: string;
  filters?: CrossChainFilters;
  onFilterChange?: CrossChainFilterChangeHandler;
}

const TransactionsCrossChainTable = ({ data, isLoading, top, stickyHeader, currentAddress, resetKey, filters, onFilterChange }: Props) => {
  const TableHeaderComponent = stickyHeader ? TableHeaderSticky : TableHeader;
  const { cutRef, renderedItemsNum } = useLazyRenderedList({ list: data, isEnabled: !isLoading, resetKey });

  const renderFilter = (column: CrossChainFilterColumn) => {
    if (!filters || !onFilterChange) {
      return null;
    }

    return <CrossChainFilterByColumn column={ column } filters={ filters } onFilterChange={ onFilterChange } isLoading={ isLoading }/>;
  };

  return (
    <AddressHighlightProvider>
      <TableRoot tableLayout="auto" minW="1200px">
        <TableHeaderComponent top={ stickyHeader ? top : undefined }>
          <TableRow>
            <TableColumnHeader w={ currentAddress ? '60px' : '42px' }/>
            <TableColumnHeader>
              <Flex alignItems="center" flexWrap="nowrap">
                Message
                <TimeFormatToggle/>
              </Flex>
            </TableColumnHeader>
            <TableColumnHeader>Msg sender</TableColumnHeader>
            <TableColumnHeader>
              <Flex alignItems="center" columnGap={ 1 }>
                Source tx
                { renderFilter('source') }
              </Flex>
            </TableColumnHeader>
            <TableColumnHeader>
              <Flex alignItems="center" columnGap={ 1 }>
                Dest tx
                { renderFilter('destination') }
              </Flex>
            </TableColumnHeader>
            <TableColumnHeader>Transf</TableColumnHeader>
            <TableColumnHeader>Sender</TableColumnHeader>
            <TableColumnHeader>Recipient</TableColumnHeader>
            <TableColumnHeader>
              <Flex alignItems="center" columnGap={ 1 }>
                Protocol
                { renderFilter('protocol') }
              </Flex>
            </TableColumnHeader>
          </TableRow>
        </TableHeaderComponent>
        <TableBody>
          { data.slice(0, renderedItemsNum).map((item, index) => (
            <TransactionsCrossChainTableItem
              key={ item.message_id + (isLoading ? String(index) : '') }
              data={ item }
              isLoading={ isLoading }
              currentAddress={ currentAddress }
            />
          )) }
          <TableRow ref={ cutRef }/>
        </TableBody>
      </TableRoot>
    </AddressHighlightProvider>
  );
};

export default React.memo(TransactionsCrossChainTable);
