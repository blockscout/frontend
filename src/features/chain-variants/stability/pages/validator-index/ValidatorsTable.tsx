// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type {
  ValidatorStability,
  ValidatorsStabilitySortingField,
  ValidatorsStabilitySortingValue,
} from 'src/features/chain-variants/stability/types/api';

import { ACTION_BAR_HEIGHT_DESKTOP } from 'src/shell/page/action-bar/ActionBar';

import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';
import getNextSortValue from 'src/shared/sort/get-next-sort-value';

import { TableBody, TableColumnHeader, TableColumnHeaderSortable, TableHeaderSticky, TableRoot, TableRow } from 'src/toolkit/chakra/table';

import { VALIDATORS_STABILITY_SORT_SEQUENCE } from './utils';
import ValidatorsTableItem from './ValidatorsTableItem';

interface Props {
  data: Array<ValidatorStability>;
  sort: ValidatorsStabilitySortingValue;
  setSorting: ({ value }: { value: Array<ValidatorsStabilitySortingValue> }) => void;
  isLoading?: boolean;
  resetKey?: string;
}

const ValidatorsTable = ({ data, sort, setSorting, isLoading, resetKey }: Props) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList({ list: data, isEnabled: !isLoading, resetKey });

  const onSortToggle = React.useCallback((field: ValidatorsStabilitySortingField) => {
    const value = getNextSortValue<ValidatorsStabilitySortingField, ValidatorsStabilitySortingValue>(VALIDATORS_STABILITY_SORT_SEQUENCE, field)(sort);
    setSorting({ value: [ value ] });
  }, [ sort, setSorting ]);

  return (
    <TableRoot>
      <TableHeaderSticky top={ ACTION_BAR_HEIGHT_DESKTOP }>
        <TableRow>
          <TableColumnHeader width="50%">Validator's address</TableColumnHeader>
          <TableColumnHeaderSortable
            width="25%"
            sortField="state"
            sortValue={ sort }
            onSortToggle={ onSortToggle }
          >
            Status
          </TableColumnHeaderSortable>
          <TableColumnHeaderSortable
            width="25%"
            sortField="blocks_validated"
            sortValue={ sort }
            onSortToggle={ onSortToggle }
            isNumeric
          >
            Blocks
          </TableColumnHeaderSortable>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { data.slice(0, renderedItemsNum).map((item, index) => (
          <ValidatorsTableItem
            key={ item.address.hash + (isLoading ? index : '') }
            data={ item }
            isLoading={ isLoading }/>
        )) }
        <TableRow ref={ cutRef }/>
      </TableBody>
    </TableRoot>
  );
};

export default React.memo(ValidatorsTable);
