// SPDX-License-Identifier: LicenseRef-Blockscout

import { createListCollection } from '@chakra-ui/react';
import React from 'react';

import type { VerifiedContractsFilter as TVerifiedContractsFilter } from 'src/slices/contract/types/api';

import useApiQuery from 'src/api/hooks/useApiQuery';

import { formatLanguageName } from 'src/slices/contract/utils/language';

import PopoverFilterRadio from 'src/shared/filters/PopoverFilterRadio';

import type { SelectOption } from 'src/toolkit/chakra/select';

interface Props {
  hasActiveFilter: boolean;
  defaultValue: TVerifiedContractsFilter | undefined;
  onChange: (nextValue: string | Array<string>) => void;
}

const VerifiedContractsFilter = ({ onChange, defaultValue, hasActiveFilter }: Props) => {

  const { data, isPending } = useApiQuery('general:config_contract_languages');

  const options = React.useMemo(() => {
    return [
      { value: 'all', label: 'All' },
      ...(data?.languages || []).map((language) => ({ value: language, label: formatLanguageName(language) })),
    ];
  }, [ data?.languages ]);

  const collection = React.useMemo(() => {
    return createListCollection<SelectOption>({ items: options });
  }, [ options ]);

  return (
    <PopoverFilterRadio
      name="verified_contracts_filter"
      collection={ collection }
      onChange={ onChange }
      hasActiveFilter={ hasActiveFilter }
      initialValue={ defaultValue || options[0].value }
      isLoading={ isPending }
    />
  );
};

export default React.memo(VerifiedContractsFilter);
