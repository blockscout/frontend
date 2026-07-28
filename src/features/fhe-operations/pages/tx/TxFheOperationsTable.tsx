// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import { AddressHighlightProvider } from 'src/slices/address/contexts/address-highlight';

import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

import { TableBody, TableColumnHeader, TableHeader, TableRoot, TableRow } from 'src/toolkit/chakra/table';

import TxFHEOperationsTableItem from './TxFheOperationsTableItem';

interface Props {
  data: Array<schemas['FheOperation']>;
  isLoading?: boolean;
  resetKey?: string;
}

const TxFHEOperationsTable = ({ data, isLoading, resetKey }: Props) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList({ list: data, isEnabled: !isLoading, resetKey });

  return (
    <AddressHighlightProvider>
      <Box maxW="100%" overflowX="auto" hideBelow="lg">
        <TableRoot tableLayout="fixed" minWidth="900px" w="100%">
          <TableHeader>
            <TableRow>
              <TableColumnHeader width="10%">Index</TableColumnHeader>
              <TableColumnHeader width="15%">Operation</TableColumnHeader>
              <TableColumnHeader width="12%">Type</TableColumnHeader>
              <TableColumnHeader width="12%">FHE type</TableColumnHeader>
              <TableColumnHeader width="12%">Mode</TableColumnHeader>
              <TableColumnHeader width="12%">HCU cost</TableColumnHeader>
              <TableColumnHeader width="12%">HCU depth</TableColumnHeader>
              <TableColumnHeader width="24%">Caller</TableColumnHeader>
            </TableRow>
          </TableHeader>
          <TableBody>
            { data.slice(0, renderedItemsNum).map((op) => (
              <TxFHEOperationsTableItem
                key={ op.log_index }
                data={ op }
                isLoading={ isLoading }
              />
            )) }
            <TableRow ref={ cutRef }/>
          </TableBody>
        </TableRoot>
      </Box>
    </AddressHighlightProvider>
  );
};

export default React.memo(TxFHEOperationsTable);
