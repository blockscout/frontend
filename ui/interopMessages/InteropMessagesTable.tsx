import { Table, Tbody, Th, Tr } from '@chakra-ui/react';
import React from 'react';

import type { InteropMessage } from 'types/api/interop';

import { default as Thead } from 'ui/shared/TheadSticky';

import InteropMessagesTableItem from './InteropMessagesTableItem';

interface Props {
  items?: Array<InteropMessage>;
  top: number;
  isLoading?: boolean;
}

const InteropMessagesTable = ({ items, top, isLoading }: Props) => {
  return (
    <Table style={{ tableLayout: 'auto' }} size="sm">
      <Thead top={ top }>
        <Tr>
          <Th></Th>
          <Th>Message</Th>
          <Th>Age</Th>
          <Th>Status</Th>
          <Th>Source tx</Th>
          <Th>Destination tx</Th>
          <Th>Sender</Th>
          <Th>In/Out</Th>
          <Th>Target</Th>
        </Tr>
      </Thead>
      <Tbody>
        { items?.map((item, index) => (
          <InteropMessagesTableItem
            key={ item.init_transaction_hash + '_' + index }
            item={ item }
            isLoading={ isLoading }
          />
        )) }
      </Tbody>
    </Table>
  );
};

export default React.memo(InteropMessagesTable);
