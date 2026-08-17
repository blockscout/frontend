// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { InterchainTransfer } from '@blockscout/interchain-indexer-types';

import { AddressHighlightProvider } from 'src/slices/address/contexts/address-highlight';

import TimeFormatToggle from 'src/shared/date-and-time/TimeFormatToggle';
import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'src/toolkit/chakra/table';

import TokenTransfersCrossChainTableItem from './TokenTransfersCrossChainTableItem';
import { getItemKey } from './utils';

interface Props {
  data: Array<InterchainTransfer>;
  isLoading?: boolean;
  top?: number;
  currentAddress?: string;
  resetKey?: string;
}

const TokenTransfersCrossChainTable = ({ data, isLoading, top, currentAddress, resetKey }: Props) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList({ list: data, isEnabled: !isLoading, resetKey });

  return (
    <AddressHighlightProvider>
      <TableRoot tableLayout="auto">
        <TableHeaderSticky top={ top }>
          <TableRow>
            <TableColumnHeader w={ currentAddress ? '86px' : '42px' }/>
            <TableColumnHeader>Source token</TableColumnHeader>
            <TableColumnHeader/>
            <TableColumnHeader>Target token</TableColumnHeader>
            <TableColumnHeader>Source tx</TableColumnHeader>
            <TableColumnHeader>Dest tx</TableColumnHeader>
            <TableColumnHeader>Protocol</TableColumnHeader>
            <TableColumnHeader>Message</TableColumnHeader>
            <TableColumnHeader>
              <Flex alignItems="center" flexWrap="nowrap">
                Timestamp
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
