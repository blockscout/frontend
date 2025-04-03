import React from 'react';

import type { VerifiedContract } from 'types/api/contracts';
import type { VerifiedContractsSortingField, VerifiedContractsSortingValue } from 'types/api/verifiedContracts';

import { currencyUnits } from 'lib/units';
import { TableBody, TableColumnHeader, TableColumnHeaderSortable, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import getNextSortValue from 'ui/shared/sort/getNextSortValue';
import { SORT_SEQUENCE } from 'ui/verifiedContracts/utils';

import VerifiedContractsTableItem from './VerifiedContractsTableItem';

interface Props {
  data: Array<VerifiedContract>;
  sort: VerifiedContractsSortingValue;
  setSorting: ({ value }: { value: Array<string> }) => void;
  isLoading?: boolean;
}

const VerifiedContractsTable = ({ data, sort, setSorting, isLoading }: Props) => {
  const onSortToggle = React.useCallback((field: VerifiedContractsSortingField) => {
    const value = getNextSortValue<VerifiedContractsSortingField, VerifiedContractsSortingValue>(SORT_SEQUENCE, field)(sort);
    setSorting({ value: [ value ] });
  }, [ sort, setSorting ]);

  return (
    <TableRoot>
      <TableHeaderSticky top={ ACTION_BAR_HEIGHT_DESKTOP }>
        <TableRow>
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
          <TableColumnHeader width="150px">Verified</TableColumnHeader>
          <TableColumnHeader width="130px">License</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { data.map((item, index) => (
          <VerifiedContractsTableItem
            key={ item.address.hash + (isLoading ? index : '') }
            data={ item }
            isLoading={ isLoading }/>
        )) }
      </TableBody>
    </TableRoot>
  );
};

export default React.memo(VerifiedContractsTable);
