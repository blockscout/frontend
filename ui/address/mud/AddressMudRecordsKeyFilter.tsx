import React from 'react';

import FilterInput from 'ui/shared/filters/FilterInput';
import TableColumnFilter from 'ui/shared/filters/TableColumnFilter';

type Props = {
  value?: string;
  handleFilterChange: (val: string) => void;
  title: string;
  columnName: string;
  isLoading?: boolean;
};

const AddressMudRecordsKeyFilter = ({ value = '', handleFilterChange, columnName, title, isLoading }: Props) => {
  const [ filterValue, setFilterValue ] = React.useState<string>(value);

  const onFilter = React.useCallback(() => {
    handleFilterChange(filterValue);
  }, [ handleFilterChange, filterValue ]);

  return (
    <TableColumnFilter
      columnName={ columnName }
      title={ title }
      isActive={ Boolean(value) }
      isFilled={ filterValue !== value }
      onFilter={ onFilter }
      isLoading={ isLoading }
      w="350px"
    >
      <FilterInput
        initialValue={ value }
        size="xs"
        onChange={ setFilterValue }
        placeholder={ columnName }
      />
    </TableColumnFilter>
  );
};

export default AddressMudRecordsKeyFilter;
