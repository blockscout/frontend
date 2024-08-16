import React from 'react';

import FilterInput from 'ui/shared/filters/FilterInput';
import TableColumnFilter from 'ui/shared/filters/TableColumnFilter';

type Props = {
  value?: string;
  handleFilterChange: (val: string) => void;
  title: string;
  columnName: string;
  onClose?: () => void;
}

const AddressMudRecordsKeyFilter = ({ value = '', handleFilterChange, columnName, title, onClose }: Props) => {
  const [ filterValue, setFilterValue ] = React.useState<string>(value);

  const onFilter = React.useCallback(() => {
    handleFilterChange(filterValue);
  }, [ handleFilterChange, filterValue ]);

  return (
    <TableColumnFilter
      title={ title }
      isFilled={ filterValue !== value }
      onFilter={ onFilter }
      onClose={ onClose }
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
