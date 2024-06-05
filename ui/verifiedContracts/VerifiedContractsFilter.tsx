import React from 'react';

import type { VerifiedContractsFilters } from 'types/api/contracts';

import PopoverFilterRadio from 'ui/shared/filters/PopoverFilterRadio';

const OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'solidity', label: 'Solidity' },
  { value: 'vyper', label: 'Vyper' },
  { value: 'yul', label: 'Yul' },
];

interface Props {
  hasActiveFilter: boolean;
  defaultValue: VerifiedContractsFilters['filter'] | undefined;
  onChange: (nextValue: string | Array<string>) => void;
}

const VerifiedContractsFilter = ({ onChange, defaultValue, hasActiveFilter }: Props) => {
  return (
    <PopoverFilterRadio
      name="verified_contracts_filter"
      options={ OPTIONS }
      onChange={ onChange }
      hasActiveFilter={ hasActiveFilter }
      defaultValue={ defaultValue || OPTIONS[0].value }
    />
  );
};

export default React.memo(VerifiedContractsFilter);
