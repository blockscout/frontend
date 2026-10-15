// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { InteropMessage } from 'src/features/op-interop/types/api';

import TimeFormatToggle from 'src/shared/date-and-time/TimeFormatToggle';
import { useUniqueKeys } from 'src/shared/lists/get-unique-keys';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'src/toolkit/chakra/table';

import InteropMessagesTableItem from './InteropMessagesTableItem';

interface Props {
  items?: Array<InteropMessage>;
  top: number;
  isLoading?: boolean;
}

const getBaseKey = (item: InteropMessage): string => item.init_transaction_hash + '_' + item.nonce;

const InteropMessagesTable = ({ items, top, isLoading }: Props) => {
  const keys = useUniqueKeys(items, getBaseKey);

  return (
    <TableRoot tableLayout="auto" minW="1200px">
      <TableHeaderSticky top={ top }>
        <TableRow>
          <TableColumnHeader/>
          <TableColumnHeader>Message</TableColumnHeader>
          <TableColumnHeader>
            Timestamp
            <TimeFormatToggle/>
          </TableColumnHeader>
          <TableColumnHeader>Status</TableColumnHeader>
          <TableColumnHeader>Source tx</TableColumnHeader>
          <TableColumnHeader>Destination tx</TableColumnHeader>
          <TableColumnHeader>Sender</TableColumnHeader>
          <TableColumnHeader>In/Out</TableColumnHeader>
          <TableColumnHeader>Target</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { items?.map((item, index) => (
          <InteropMessagesTableItem
            key={ keys[index] }
            item={ item }
            isLoading={ isLoading }
          />
        )) }
      </TableBody>
    </TableRoot>
  );
};

export default React.memo(InteropMessagesTable);
