// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { SearchResultCellsProps } from './types';

import * as TxEntity from 'src/slices/tx/components/entity/TxEntity';

import Time from 'src/shared/date-and-time/Time';

import { TableCell } from 'src/toolkit/chakra/table';

const SearchResultTxCells = ({ data, isLoading, onLinkClick }: SearchResultCellsProps<'transaction'>) => {
  return (
    <>
      <TableCell colSpan={ 2 } fontSize="sm">
        <TxEntity.Container>
          <TxEntity.Icon/>
          <TxEntity.Link
            isLoading={ isLoading }
            hash={ data.transaction_hash }
            onClick={ onLinkClick }
          >
            <TxEntity.Content
              asProp="mark"
              hash={ data.transaction_hash }
              textStyle="sm"
              fontWeight={ 700 }
            />
          </TxEntity.Link>
        </TxEntity.Container>
      </TableCell>
      <TableCell fontSize="sm" verticalAlign="middle" isNumeric>
        { data.timestamp && <Time timestamp={ data.timestamp } color="text.secondary" format="lll_s"/> }
      </TableCell>
    </>
  );
};

export default React.memo(SearchResultTxCells);
