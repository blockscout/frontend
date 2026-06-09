// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import TableColumnFilter from 'src/shared/filters/TableColumnFilter';

import { FilterInput } from 'src/toolkit/components/filters/FilterInput';

type Props = {
  value?: string;
  handleFilterChange: (val: string) => void;
  title: string;
  columnName: string;
};

const AddressMudRecordsKeyFilterContent = ({ value = '', handleFilterChange, columnName, title }: Props) => {
  const [ filterValue, setFilterValue ] = React.useState<string>(value);

  const onFilter = React.useCallback(() => {
    handleFilterChange(filterValue);
  }, [ handleFilterChange, filterValue ]);

  return (
    <TableColumnFilter
      title={ title }
      isFilled={ Boolean(filterValue) }
      onFilter={ onFilter }
      isTouched={ filterValue !== value }
    >
      <FilterInput
        initialValue={ value }
        size="sm"
        onChange={ setFilterValue }
        placeholder={ columnName }
      />
    </TableColumnFilter>
  );
};

export default AddressMudRecordsKeyFilterContent;
