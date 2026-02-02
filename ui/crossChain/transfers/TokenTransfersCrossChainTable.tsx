import React from 'react';

import type { InterchainTransfer } from '@blockscout/interchain-indexer-types';

import { AddressHighlightProvider } from 'lib/contexts/addressHighlight';
import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import TimeFormatToggle from 'ui/shared/time/TimeFormatToggle';

import TokenTransfersCrossChainTableItem from './TokenTransfersCrossChainTableItem';
import { getItemKey } from './utils';

interface Props {
  data: Array<InterchainTransfer>;
  isLoading?: boolean;
  top?: number;
}

const TokenTransfersCrossChainTable = ({ data, isLoading, top }: Props) => {
  return (
    <AddressHighlightProvider>
      <TableRoot minW="1200px">
        <TableHeaderSticky top={ top }>
          <TableRow>
            <TableColumnHeader w="42px"/>
            <TableColumnHeader w="20%">Source token</TableColumnHeader>
            <TableColumnHeader w="32px"/>
            <TableColumnHeader w="20%">Target token</TableColumnHeader>
            <TableColumnHeader w="20%">Source tx</TableColumnHeader>
            <TableColumnHeader w="20%">Dest tx</TableColumnHeader>
            <TableColumnHeader w="20%">Protocol</TableColumnHeader>
            <TableColumnHeader w="130px">Message</TableColumnHeader>
            <TableColumnHeader w="180px">
              Timestamp
              <TimeFormatToggle/>
            </TableColumnHeader>
          </TableRow>
        </TableHeaderSticky>
        <TableBody>
          { data.map((item, index) => (
            <TokenTransfersCrossChainTableItem
              key={ getItemKey(item, isLoading ? index : undefined) }
              data={ item }
              isLoading={ isLoading }
            />
          )) }
        </TableBody>
      </TableRoot>
    </AddressHighlightProvider>
  );
};

export default React.memo(TokenTransfersCrossChainTable);
