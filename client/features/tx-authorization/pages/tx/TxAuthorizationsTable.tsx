// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { TxAuthorization } from 'client/features/tx-authorization/types/api';

import { AddressHighlightProvider } from 'client/slices/address/contexts/address-highlight';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';

import TxAuthorizationsTableItem from './TxAuthorizationsTableItem';

interface Props {
  data: Array<TxAuthorization> | undefined;
  isLoading?: boolean;
}

const TxAuthorizationsTable = ({ data, isLoading }: Props) => {
  return (
    <AddressHighlightProvider>
      <TableRoot>
        <TableHeaderSticky>
          <TableRow>
            <TableColumnHeader width="50%">Authority</TableColumnHeader>
            <TableColumnHeader width="50%">Delegated address</TableColumnHeader>
            <TableColumnHeader width="120px">Chain</TableColumnHeader>
            <TableColumnHeader width="120px">Nonce</TableColumnHeader>
            <TableColumnHeader width="200px">Status</TableColumnHeader>
          </TableRow>
        </TableHeaderSticky>
        <TableBody>
          { data?.map((item, index) => (
            <TxAuthorizationsTableItem key={ item.nonce.toString() + (isLoading ? index : '') } { ...item } isLoading={ isLoading }/>
          )) }
        </TableBody>
      </TableRoot>
    </AddressHighlightProvider>
  );
};

export default TxAuthorizationsTable;
