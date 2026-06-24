// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';

import { TableBody, TableColumnHeader, TableHeader, TableRoot, TableRow } from 'src/toolkit/chakra/table';

import ArbitrumL2TxnWithdrawalsTableItem from './ArbitrumL2TxnWithdrawalsTableItem';

interface Props {
  data: Array<schemas['ArbitrumWithdrawal']>;
  txHash: string | undefined;
  isLoading: boolean;
}

const ArbitrumL2TxnWithdrawalsTable = ({ data, txHash, isLoading }: Props) => {
  return (
    <TableRoot minW="900px">
      <TableHeader>
        <TableRow>
          <TableColumnHeader width="150px">Message #</TableColumnHeader>
          <TableColumnHeader width="30%">Receiver</TableColumnHeader>
          <TableColumnHeader width="30%" isNumeric>Value</TableColumnHeader>
          <TableColumnHeader width="40%">Status</TableColumnHeader>
        </TableRow>
      </TableHeader>
      <TableBody>
        { data.map((item, index) => (
          <ArbitrumL2TxnWithdrawalsTableItem
            key={ String(item.id) + (isLoading ? index : '') }
            data={ item }
            isLoading={ isLoading }
            txHash={ txHash }/>
        )) }
      </TableBody>
    </TableRoot>
  );
};

export default React.memo(ArbitrumL2TxnWithdrawalsTable);
