// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type {
  ValidatorBlackfort,
  ValidatorsBlackfortSortingField,
  ValidatorsBlackfortSortingValue,
} from 'client/features/chain-variants/blackfort/types/api';

import { currencyUnits } from 'client/slices/chain/units';

import getNextSortValue from 'client/shared/sort/get-next-sort-value';

import { TableBody, TableColumnHeader, TableColumnHeaderSortable, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';

import { VALIDATORS_BLACKFORT_SORT_SEQUENCE } from './utils';
import ValidatorsTableItem from './ValidatorsTableItem';

interface Props {
  data: Array<ValidatorBlackfort>;
  sort: ValidatorsBlackfortSortingValue;
  setSorting: ({ value }: { value: Array<string> }) => void;
  isLoading?: boolean;
  top: number;
}

const ValidatorsTable = ({ data, sort, setSorting, isLoading, top }: Props) => {

  const onSortToggle = React.useCallback((field: ValidatorsBlackfortSortingField) => {
    const value = getNextSortValue<ValidatorsBlackfortSortingField, ValidatorsBlackfortSortingValue>(VALIDATORS_BLACKFORT_SORT_SEQUENCE, field)(sort);
    setSorting({ value: [ value ] });
  }, [ sort, setSorting ]);

  return (
    <TableRoot>
      <TableHeaderSticky top={ top }>
        <TableRow>
          <TableColumnHeaderSortable
            sortField="address_hash"
            sortValue={ sort }
            onSortToggle={ onSortToggle }
            indicatorPosition="right"
          >
            Validator's address
          </TableColumnHeaderSortable>
          <TableColumnHeader>Name</TableColumnHeader>
          <TableColumnHeader isNumeric>Commission</TableColumnHeader>
          <TableColumnHeader isNumeric>{ `Self bonded ${ currencyUnits.ether }` }</TableColumnHeader>
          <TableColumnHeader isNumeric>{ `Delegated amount ${ currencyUnits.ether }` }</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { data.map((item, index) => (
          <ValidatorsTableItem
            key={ item.address.hash + (isLoading ? index : '') }
            data={ item }
            isLoading={ isLoading }/>
        )) }
      </TableBody>
    </TableRoot>
  );
};

export default React.memo(ValidatorsTable);
