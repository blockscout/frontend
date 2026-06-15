// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';
import type { VerifiedContractsSortingField, VerifiedContractsSortingValue } from 'src/slices/contract/types/api';

import { ACTION_BAR_HEIGHT_DESKTOP } from 'src/shell/page/action-bar/ActionBar';

import { currencyUnits } from 'src/slices/chain/units';
import { SORT_SEQUENCE } from 'src/slices/contract/pages/index/sort';

import { useMultichainContext } from 'src/features/multichain/context';

import TimeFormatToggle from 'src/shared/date-and-time/TimeFormatToggle';
import getNextSortValue from 'src/shared/sort/get-next-sort-value';

import { TableBody, TableColumnHeader, TableColumnHeaderSortable, TableHeaderSticky, TableRoot, TableRow } from 'src/toolkit/chakra/table';

import VerifiedContractsTableItem from './VerifiedContractsTableItem';

interface Props {
  data: Array<schemas['ListItem']>;
  sort: VerifiedContractsSortingValue;
  setSorting: ({ value }: { value: Array<string> }) => void;
  isLoading?: boolean;
}

const VerifiedContractsTable = ({ data, sort, setSorting, isLoading }: Props) => {
  const multichainContext = useMultichainContext();
  const chainData = multichainContext?.chain;

  const onSortToggle = React.useCallback((field: VerifiedContractsSortingField) => {
    const value = getNextSortValue<VerifiedContractsSortingField, VerifiedContractsSortingValue>(SORT_SEQUENCE, field)(sort);
    setSorting({ value: [ value ] });
  }, [ sort, setSorting ]);

  return (
    <TableRoot minW="1100px">
      <TableHeaderSticky top={ ACTION_BAR_HEIGHT_DESKTOP }>
        <TableRow>
          { chainData && <TableColumnHeader width="38px"/> }
          <TableColumnHeader width="50%">Contract</TableColumnHeader>
          <TableColumnHeaderSortable
            width="130px"
            isNumeric
            sortField="balance"
            sortValue={ sort }
            onSortToggle={ onSortToggle }
            disabled={ isLoading }
          >
            Balance { currencyUnits.ether }
          </TableColumnHeaderSortable>
          <TableColumnHeaderSortable
            width="130px"
            isNumeric
            sortField="transactions_count"
            sortValue={ sort }
            onSortToggle={ onSortToggle }
            disabled={ isLoading }
          >
            Txs
          </TableColumnHeaderSortable>
          <TableColumnHeader width="50%">Language / Compiler version</TableColumnHeader>
          <TableColumnHeader width="80px">Settings</TableColumnHeader>
          <TableColumnHeader width="200px">
            Verified
            <TimeFormatToggle/>
          </TableColumnHeader>
          <TableColumnHeader width="130px">License</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { data.map((item, index) => (
          <VerifiedContractsTableItem
            key={ `${ item.address?.hash ?? '' }${ isLoading ? index : '' }` }
            data={ item }
            isLoading={ isLoading }
            chainData={ chainData }
          />
        )) }
      </TableBody>
    </TableRoot>
  );
};

export default React.memo(VerifiedContractsTable);
