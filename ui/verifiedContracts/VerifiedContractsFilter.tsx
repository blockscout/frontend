import { createListCollection } from '@chakra-ui/react';
import React from 'react';

import type { VerifiedContractsFilter as TVerifiedContractsFilter } from 'types/api/contracts';

import config from 'configs/app';
import type { SelectOption } from 'toolkit/chakra/select';
import PopoverFilterRadio from 'ui/shared/filters/PopoverFilterRadio';

const OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'solidity', label: 'Solidity' },
  { value: 'vyper', label: 'Vyper' },
  { value: 'yul', label: 'Yul' },
  { value: 'scilla', label: 'Scilla' },
  { value: 'geas', label: 'Geas' },
  { value: 'stylus_rust', label: 'Stylus Rust' },
];

interface Props {
  hasActiveFilter: boolean;
  defaultValue: TVerifiedContractsFilter | undefined;
  onChange: (nextValue: string | Array<string>) => void;
  chainConfig?: typeof config;
}

const VerifiedContractsFilter = ({ onChange, defaultValue, hasActiveFilter, chainConfig }: Props) => {
  const options = React.useMemo(() => {
    return OPTIONS.filter(({ value }) => value === 'all' || (chainConfig || config).UI.views.address.languageFilters.includes(value));
  }, [ chainConfig ]);

  const collection = React.useMemo(() => {
    return createListCollection<SelectOption>({ items: options });
  }, [ options ]);

  return (
    <PopoverFilterRadio
      name="verified_contracts_filter"
      collection={ collection }
      onChange={ onChange }
      hasActiveFilter={ hasActiveFilter }
      initialValue={ defaultValue || OPTIONS[0].value }
    />
  );
};

export default React.memo(VerifiedContractsFilter);
