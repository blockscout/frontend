// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';
import type { HotContractsSortingField, HotContractsSortingValue } from 'src/features/hot-contracts/types/api';

import { ACTION_BAR_HEIGHT_DESKTOP } from 'src/shell/page/action-bar/ActionBar';

import { currencyUnits } from 'src/slices/chain/units';

import getNextSortValue from 'src/shared/sort/get-next-sort-value';

import { TableBody, TableColumnHeader, TableColumnHeaderSortable, TableHeaderSticky, TableRoot, TableRow } from 'src/toolkit/chakra/table';

import { SORT_SEQUENCE } from '../../utils';
import HotContractsTableItem from './HotContractsTableItem';

interface Props {
  items: Array<schemas['HotContract']> | undefined;
  isLoading?: boolean;
  sort: HotContractsSortingValue;
  setSorting: ({ value }: { value: Array<string> }) => void;
  exchangeRate: string | null;
};

const HotContractsTable = ({ items, isLoading, sort, setSorting, exchangeRate }: Props) => {

  const onSortToggle = React.useCallback((field: HotContractsSortingField) => {
    const value = getNextSortValue<HotContractsSortingField, HotContractsSortingValue>(SORT_SEQUENCE, field)(sort);
    setSorting({ value: [ value ] });
  }, [ sort, setSorting ]);

  return (
    <TableRoot minWidth="900px">
      <TableHeaderSticky top={ ACTION_BAR_HEIGHT_DESKTOP }>
        <TableRow>
          <TableColumnHeader width="25%">Contract</TableColumnHeader>
          <TableColumnHeaderSortable
            width="25%"
            isNumeric
            sortField="transactions_count"
            sortValue={ sort }
            onSortToggle={ onSortToggle }
            disabled={ isLoading }
          >
            Txn count
          </TableColumnHeaderSortable>
          <TableColumnHeaderSortable
            width="25%"
            isNumeric
            sortField="total_gas_used"
            sortValue={ sort }
            onSortToggle={ onSortToggle }
            disabled={ isLoading }
          >
            Gas used
          </TableColumnHeaderSortable>
          <TableColumnHeader width="25%" isNumeric>Balance { currencyUnits.ether }</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { items?.map((item, index) => (
          <HotContractsTableItem key={ index } isLoading={ isLoading } data={ item } exchangeRate={ exchangeRate }/>
        )) }
      </TableBody>
    </TableRoot>
  );
};

export default HotContractsTable;
