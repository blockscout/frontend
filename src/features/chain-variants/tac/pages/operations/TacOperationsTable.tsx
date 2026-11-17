// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type * as tac from '@blockscout/tac-operation-lifecycle-types';

import { AddressHighlightProvider } from 'src/slices/address/contexts/address-highlight';

import TimeFormatToggle from 'src/shared/date-and-time/TimeFormatToggle';
import { useUniqueKeys } from 'src/shared/lists/get-unique-keys';
import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'src/toolkit/chakra/table';

import TacOperationsTableItem from './TacOperationsTableItem';

type Props = {
  items: Array<tac.V2OperationBriefDetails>;
  isLoading?: boolean;
  resetKey?: string;
};

const getBaseKey = (item: tac.V2OperationBriefDetails): string => String(item.operation_id);

const TacOperationsTable = ({ items, isLoading, resetKey }: Props) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList({ list: items, isEnabled: !isLoading, resetKey });
  const keys = useUniqueKeys(items, getBaseKey);

  return (
    <AddressHighlightProvider>
      <TableRoot minW="950px">
        <TableHeaderSticky top={ 68 }>
          <TableRow>
            <TableColumnHeader w="250px">Status</TableColumnHeader>
            <TableColumnHeader w="100%">Operation</TableColumnHeader>
            <TableColumnHeader w="200px">
              Timestamp
              <TimeFormatToggle/>
            </TableColumnHeader>
            <TableColumnHeader w="250px">Sender</TableColumnHeader>
          </TableRow>
        </TableHeaderSticky>
        <TableBody>
          { items.slice(0, renderedItemsNum).map((item, index) => (
            <TacOperationsTableItem key={ keys[index] } item={ item } isLoading={ isLoading }/>
          )) }
          <TableRow ref={ cutRef }/>
        </TableBody>
      </TableRoot>
    </AddressHighlightProvider>
  );
};

export default TacOperationsTable;
