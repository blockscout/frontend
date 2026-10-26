// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { InterchainTransfer } from '@blockscout/interchain-indexer-types';
import type { CrossChainFilters } from 'src/features/cross-chain-txs/types/api';

import { AddressHighlightProvider } from 'src/slices/address/contexts/address-highlight';

import TimeFormatToggle from 'src/shared/date-and-time/TimeFormatToggle';
import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'src/toolkit/chakra/table';

import type { CrossChainFilterColumn } from '../filters/CrossChainFilterByColumn';
import CrossChainFilterByColumn from '../filters/CrossChainFilterByColumn';
import type { CrossChainFilterChangeHandler } from '../filters/utils';
import TokenTransfersCrossChainTableItem from './TokenTransfersCrossChainTableItem';
import { getItemKey } from './utils';

interface Props {
  data: Array<InterchainTransfer>;
  isLoading?: boolean;
  top?: number;
  currentAddress?: string;
  resetKey?: string;
  filters?: CrossChainFilters;
  onFilterChange?: CrossChainFilterChangeHandler;
}

const TokenTransfersCrossChainTable = ({ data, isLoading, top, currentAddress, resetKey, filters, onFilterChange }: Props) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList({ list: data, isEnabled: !isLoading, resetKey });

  const renderFilter = (column: CrossChainFilterColumn) => {
    if (!filters || !onFilterChange) {
      return null;
    }

    return <CrossChainFilterByColumn column={ column } filters={ filters } onFilterChange={ onFilterChange } isLoading={ isLoading }/>;
  };

  return (
    <AddressHighlightProvider>
      <TableRoot tableLayout="auto" minW="1100px">
        <TableHeaderSticky top={ top }>
          <TableRow>
            <TableColumnHeader w={ currentAddress ? '60px' : '42px' }/>
            <TableColumnHeader>Source token</TableColumnHeader>
            <TableColumnHeader>Target token</TableColumnHeader>
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
            <TableColumnHeader>
              <Flex alignItems="center" columnGap={ 1 }>
                Protocol
                { renderFilter('protocol') }
              </Flex>
            </TableColumnHeader>
            <TableColumnHeader>
              <Flex alignItems="center" flexWrap="nowrap">
                Message
                <TimeFormatToggle/>
              </Flex>
            </TableColumnHeader>
          </TableRow>
        </TableHeaderSticky>
        <TableBody>
          { data.slice(0, renderedItemsNum).map((item, index) => (
            <TokenTransfersCrossChainTableItem
              key={ getItemKey(item, isLoading ? index : undefined) }
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

export default React.memo(TokenTransfersCrossChainTable);
