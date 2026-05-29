// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { UserOpsItem } from 'src/features/user-ops/types/api';

import { AddressHighlightProvider } from 'src/slices/address/contexts/address-highlight';

import { useMultichainContext } from 'src/features/multichain/context';

import config from 'src/config';
import TimeFormatToggle from 'src/shared/date-and-time/TimeFormatToggle';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'src/toolkit/chakra/table';

import UserOpsTableItem from './UserOpsTableItem';

type Props = {
  items: Array<UserOpsItem>;
  isLoading?: boolean;
  top: number;
  showTx: boolean;
  showSender: boolean;
};

const UserOpsTable = ({ items, isLoading, top, showTx, showSender }: Props) => {
  const multichainContext = useMultichainContext();
  const chainData = multichainContext?.chain;
  const chainConfig = (multichainContext?.chain.app_config || config);

  return (
    <AddressHighlightProvider>
      <TableRoot minW="1000px">
        <TableHeaderSticky top={ top }>
          <TableRow>
            { chainData && <TableColumnHeader width="38px"></TableColumnHeader> }
            <TableColumnHeader w="60%">User op hash</TableColumnHeader>
            <TableColumnHeader w="180px">
              Timestamp
              <TimeFormatToggle/>
            </TableColumnHeader>
            <TableColumnHeader w="140px">Status</TableColumnHeader>
            { showSender && <TableColumnHeader w="160px">Sender</TableColumnHeader> }
            { showTx && <TableColumnHeader w="160px">Tx hash</TableColumnHeader> }
            <TableColumnHeader w="40%">Block</TableColumnHeader>
            { !chainConfig.slices.tx.hiddenFields?.tx_fee &&
          <TableColumnHeader w="120px" isNumeric>{ `Fee ${ chainConfig.chain.currency.symbol }` }</TableColumnHeader> }
          </TableRow>
        </TableHeaderSticky>
        <TableBody>
          { items.map((item, index) => {
            return (
              <UserOpsTableItem
                key={ item.hash + (isLoading ? String(index) : '') }
                item={ item }
                isLoading={ isLoading }
                showSender={ showSender }
                showTx={ showTx }
                chainData={ chainData }
              />
            );
          }) }
        </TableBody>
      </TableRoot>
    </AddressHighlightProvider>
  );
};

export default UserOpsTable;
