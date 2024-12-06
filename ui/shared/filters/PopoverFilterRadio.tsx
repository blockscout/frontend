import React from 'react';

import type { SelectOption } from 'ui/shared/select/types';

import FilterButton from 'ui/shared/filters/FilterButton';
import Select from 'ui/shared/select/Select';
interface Props {
  name: string;
  options: Array<SelectOption>;
  hasActiveFilter: boolean;
  defaultValue?: string;
  isLoading?: boolean;
  onChange: (nextValue: string) => void;
}

const PopoverFilterRadio = ({ name, hasActiveFilter, options, isLoading, onChange, defaultValue }: Props) => {
  return (
    <Select
      options={ options }
      name={ name }
      defaultValue={ defaultValue }
      onChange={ onChange }
    >
      { ({ isOpen, onToggle }) => (
        <FilterButton
          isActive={ isOpen }
          onClick={ onToggle }
          appliedFiltersNum={ hasActiveFilter ? 1 : 0 }
          isLoading={ isLoading }
        />
      ) }
    </Select>
  );
};

export default React.memo(PopoverFilterRadio);
