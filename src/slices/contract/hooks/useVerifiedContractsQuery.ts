// SPDX-License-Identifier: LicenseRef-Blockscout

import { debounce } from 'es-toolkit';
import React from 'react';

import type { ExternalChainExtended } from 'src/shared/external-chains/types';
import type {
  VerifiedContractsFilters,
  VerifiedContractsSorting,
  VerifiedContractsSortingField,
  VerifiedContractsSortingValue,
} from 'src/slices/contract/types/api';

import { SORT_OPTIONS } from 'src/slices/contract/pages/index/sort';
import { VERIFIED_CONTRACT_INFO } from 'src/slices/contract/stubs';

import useQueryWithPages from 'src/shared/pagination/useQueryWithPages';
import { generateListStub } from 'src/shared/pagination/utils';
import getQueryParamString from 'src/shared/router/get-query-param-string';
import getSortParamsFromValue from 'src/shared/sort/get-sort-params-from-value';
import getSortValueFromQuery from 'src/shared/sort/get-sort-value-from-query';

import { SECOND } from 'src/toolkit/utils/consts';

const SEARCH_DEBOUNCE = 0.3 * SECOND;

interface Props {
  chain?: ExternalChainExtended;
}

export default function useVerifiedContractsQuery({ chain }: Props = {}) {
  const query = useQueryWithPages({
    resourceName: 'core:verified_contracts',
    options: {
      placeholderData: generateListStub<'core:verified_contracts'>(
        VERIFIED_CONTRACT_INFO,
        50,
        {
          next_page_params: {
            items_count: '50',
            smart_contract_id: '50',
          },
        },
      ),
    },
    chain,
  });

  const searchTerm = getQueryParamString(query.filters.q) || undefined;
  const type = getQueryParamString(query.filters.filter) as VerifiedContractsFilters['filter'] || undefined;
  const sort = getSortValueFromQuery<VerifiedContractsSortingValue>({ ...query.sorting }, SORT_OPTIONS) ?? 'default';

  const { onFilterChange, onSortingChange } = query;

  const onSearchTermChange = React.useMemo(
    () => debounce((value: string) => onFilterChange({ q: value, filter: type }), SEARCH_DEBOUNCE),
    [ onFilterChange, type ],
  );
  React.useEffect(() => () => onSearchTermChange.cancel(), [ onSearchTermChange ]);

  const onTypeChange = React.useCallback((value: string | Array<string>) => {
    if (Array.isArray(value)) {
      return;
    }

    const filter = value === 'all' ? undefined : value as VerifiedContractsFilters['filter'];

    onFilterChange({ q: searchTerm, filter });
  }, [ searchTerm, onFilterChange ]);

  const onSortChange = React.useCallback(({ value }: { value: Array<string> }) => {
    onSortingChange(
      getSortParamsFromValue<VerifiedContractsSortingValue, VerifiedContractsSortingField, VerifiedContractsSorting['order']>(
        value[0] as VerifiedContractsSortingValue,
      ),
    );
  }, [ onSortingChange ]);

  return React.useMemo(() => ({
    query,
    type,
    searchTerm,
    sort,
    onSearchTermChange,
    onTypeChange,
    onSortChange,
  }), [ query, type, searchTerm, sort, onSearchTermChange, onTypeChange, onSortChange ]);
}
