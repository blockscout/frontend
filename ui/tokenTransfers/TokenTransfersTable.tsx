import { Table, Tbody, Tr, Th } from '@chakra-ui/react';
import React from 'react';

import type { TokenTransfer } from 'types/api/tokenTransfer';

import { AddressHighlightProvider } from 'lib/contexts/addressHighlight';
import { default as Thead } from 'ui/shared/TheadSticky';
import TokenTransferTableItem from 'ui/tokenTransfers/TokenTransfersTableItem';

interface Props {
  items?: Array<TokenTransfer>;
  top: number;
  isLoading?: boolean;
}

const TokenTransferTable = ({ items, top, isLoading }: Props) => {
  return (
    <AddressHighlightProvider>
      <Table variant="simple" size="sm" minW="950px" style={{ tableLayout: 'auto' }}>
        <Thead top={ top }>
          <Tr>
            <Th>Txn hash</Th>
            <Th>Method</Th>
            <Th>Block</Th>
            <Th>From/To</Th>
            <Th>Token ID</Th>
            <Th isNumeric>Amount</Th>
          </Tr>
        </Thead>
        <Tbody>
          { items?.map((item, index) => (
            <TokenTransferTableItem
              key={ item.transaction_hash + item.log_index + (isLoading ? index : '') }
              item={ item }
              isLoading={ isLoading }
            />
          )) }
        </Tbody>
      </Table>
    </AddressHighlightProvider>
  );
};

export default React.memo(TokenTransferTable);
