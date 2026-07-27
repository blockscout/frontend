// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';

import { AddressHighlightProvider } from 'src/slices/address/contexts/address-highlight';
import { currencyUnits } from 'src/slices/chain/units';

import { useMultichainContext } from 'src/features/multichain/context';

import TimeFormatToggle from 'src/shared/date-and-time/TimeFormatToggle';
import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'src/toolkit/chakra/table';

import InternalTxsTableItem from './InternalTxsTableItem';

interface Props {
  data: Array<schemas['InternalTransaction']>;
  currentAddress?: string;
  isLoading?: boolean;
  top?: number;
  showBlockInfo?: boolean;
  resetKey?: string;
}

const InternalTxsTable = ({ data, currentAddress, isLoading, top, showBlockInfo = true, resetKey }: Props) => {
  const multichainContext = useMultichainContext();
  const chainData = multichainContext?.chain;
  const { cutRef, renderedItemsNum } = useLazyRenderedList({ list: data, isEnabled: !isLoading, resetKey });

  return (
    <AddressHighlightProvider>
      <TableRoot minW="900px">
        <TableHeaderSticky top={ top ?? 68 }>
          <TableRow>
            { chainData && <TableColumnHeader width="38px"></TableColumnHeader> }
            <TableColumnHeader width="280px">
              Parent txn hash
              <TimeFormatToggle/>
            </TableColumnHeader>
            <TableColumnHeader width="15%">Type</TableColumnHeader>
            { showBlockInfo && <TableColumnHeader width="15%">Block</TableColumnHeader> }
            <TableColumnHeader width="50%">From/To</TableColumnHeader>
            <TableColumnHeader width="20%" isNumeric>
              Value { currencyUnits.ether }
            </TableColumnHeader>
          </TableRow>
        </TableHeaderSticky>
        <TableBody>
          { data.slice(0, renderedItemsNum).map((item, index) => (
            <InternalTxsTableItem
              key={ item.transaction_hash + '_' + index }
              data={ item }
              currentAddress={ currentAddress }
              isLoading={ isLoading }
              showBlockInfo={ showBlockInfo }
              chainData={ chainData }
            />
          )) }
        </TableBody>
      </TableRoot>
      <div ref={ cutRef }/>
    </AddressHighlightProvider>

  );
};

export default InternalTxsTable;
