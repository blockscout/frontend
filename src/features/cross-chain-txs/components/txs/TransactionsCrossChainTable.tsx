// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { InterchainMessage } from '@blockscout/interchain-indexer-types';

import { AddressHighlightProvider } from 'src/slices/address/contexts/address-highlight';

import TimeFormatToggle from 'src/shared/date-and-time/TimeFormatToggle';
import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

import { TableBody, TableColumnHeader, TableHeader, TableHeaderSticky, TableRoot, TableRow } from 'src/toolkit/chakra/table';

import TransactionsCrossChainTableItem from './TransactionsCrossChainTableItem';

interface Props {
  data: Array<InterchainMessage>;
  isLoading?: boolean;
  top?: number;
  stickyHeader?: boolean;
  currentAddress?: string;
  resetKey?: string;
}

const TransactionsCrossChainTable = ({ data, isLoading, top, stickyHeader, currentAddress, resetKey }: Props) => {
  const TableHeaderComponent = stickyHeader ? TableHeaderSticky : TableHeader;
  const { cutRef, renderedItemsNum } = useLazyRenderedList({ list: data, isEnabled: !isLoading, resetKey });

  return (
    <AddressHighlightProvider>
      <TableRoot tableLayout="auto">
        <TableHeaderComponent top={ stickyHeader ? top : undefined }>
          <TableRow>
            <TableColumnHeader w="42px"/>
            { currentAddress && <TableColumnHeader w="44px"/> }
            <TableColumnHeader>Message</TableColumnHeader>
            <TableColumnHeader>
              <Flex alignItems="center" flexWrap="nowrap">
                Timestamp
                <TimeFormatToggle/>
              </Flex>
            </TableColumnHeader>
            <TableColumnHeader>Msg sender</TableColumnHeader>
            <TableColumnHeader>Source tx</TableColumnHeader>
            <TableColumnHeader>Dest tx</TableColumnHeader>
            <TableColumnHeader>Transf</TableColumnHeader>
            <TableColumnHeader>Sender</TableColumnHeader>
            <TableColumnHeader/>
            <TableColumnHeader>Recipient</TableColumnHeader>
            <TableColumnHeader>Protocol</TableColumnHeader>
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
