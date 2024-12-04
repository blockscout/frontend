import React from 'react';

import type { VerifiedContractsFilter as TVerifiedContractsFilter } from 'types/api/contracts';

import config from 'configs/app';
import PopoverFilterRadio from 'ui/shared/filters/PopoverFilterRadio';

type OptionValue = TVerifiedContractsFilter | 'all';

const OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'solidity', label: 'Solidity' },
  { value: 'vyper', label: 'Vyper' },
  { value: 'yul', label: 'Yul' },
  { value: 'scilla', label: 'Scilla' },
].filter(({ value }) => value === 'all' || config.UI.views.address.languageFilters.includes(value)) as Array<{ value: OptionValue; label: string }>;

interface Props {
  hasActiveFilter: boolean;
  defaultValue: TVerifiedContractsFilter | undefined;
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
