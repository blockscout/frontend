import React from 'react';

import type { InterchainMessage } from '@blockscout/interchain-indexer-types';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import TimeFormatToggle from 'ui/shared/time/TimeFormatToggle';

import TransactionsCrossChainTableItem from './TransactionsCrossChainTableItem';

interface Props {
  data: Array<InterchainMessage>;
  isLoading?: boolean;
  top?: number;
}

const TransactionsCrossChainTable = ({ data, isLoading, top }: Props) => {
  return (
    <TableRoot minW="1300px">
      <TableHeaderSticky top={ top }>
        <TableRow>
          <TableColumnHeader w="42px"/>
          <TableColumnHeader w="130px">Message</TableColumnHeader>
          <TableColumnHeader w="180px">
            Timestamp
            <TimeFormatToggle/>
          </TableColumnHeader>
          <TableColumnHeader w="140px">Msg sender</TableColumnHeader>
          <TableColumnHeader w="20%">Source tx</TableColumnHeader>
          <TableColumnHeader w="20%">Dest tx</TableColumnHeader>
          <TableColumnHeader w="60px">Transf</TableColumnHeader>
          <TableColumnHeader w="20%">Sender</TableColumnHeader>
          <TableColumnHeader w="32px"/>
          <TableColumnHeader w="20%">Recipient</TableColumnHeader>
          <TableColumnHeader w="20%">Protocol</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { data.map((item, index) => (
          <TransactionsCrossChainTableItem
            key={ item.message_id + (isLoading ? String(index) : '') }
            data={ item }
            isLoading={ isLoading }
          />
        )) }
      </TableBody>
    </TableRoot>
  );
};

export default React.memo(TransactionsCrossChainTable);
