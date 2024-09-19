import React from 'react';

import type { ValidatorsStabilityFilters } from 'types/api/validators';

import PopoverFilterRadio from 'ui/shared/filters/PopoverFilterRadio';

const OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'probation', label: 'Probation' },
  { value: 'inactive', label: 'Inactive' },
];

interface Props {
  hasActiveFilter: boolean;
  defaultValue: ValidatorsStabilityFilters['state_filter'] | undefined;
  onChange: (nextValue: string | Array<string>) => void;
}

const ValidatorsFilter = ({ onChange, defaultValue, hasActiveFilter }: Props) => {
  return (
    <PopoverFilterRadio
      name="validators_filter"
      options={ OPTIONS }
      onChange={ onChange }
      hasActiveFilter={ hasActiveFilter }
      defaultValue={ defaultValue || OPTIONS[0].value }
    />
  );
};

export default React.memo(ValidatorsFilter);
