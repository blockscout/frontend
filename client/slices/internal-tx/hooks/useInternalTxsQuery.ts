// SPDX-License-Identifier: LicenseRef-Blockscout

import { useRouter } from 'next/router';
import React from 'react';

import { INTERNAL_TX } from 'client/slices/internal-tx/stubs';

import useDebounce from 'client/shared/hooks/useDebounce';
import getQueryParamString from 'client/shared/router/get-query-param-string';

import { generateListStub } from 'stubs/utils';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';

interface Props {
  isMultichain?: boolean;
}

export default function useInternalTxsQuery({ isMultichain }: Props = {}) {
  const router = useRouter();
  const [ searchTerm, setSearchTerm ] = React.useState(getQueryParamString(router.query.transaction_hash) || undefined);
  const debouncedSearchTerm = useDebounce(searchTerm || '', 300);

  const query = useQueryWithPages({
    resourceName: 'general:internal_txs',
    filters: { transaction_hash: debouncedSearchTerm },
    options: {
      placeholderData: generateListStub<'general:internal_txs'>(
        INTERNAL_TX,
        50,
        {
          next_page_params: {
            items_count: 50,
            block_number: 1,
            index: 1,
            transaction_hash: '0x123',
            transaction_index: 1,
          },
        },
      ),
    },
    isMultichain,
  });

  const onSearchTermChange = React.useCallback((value: string) => {
    query.onFilterChange({ transaction_hash: value });
    setSearchTerm(value);
  }, [ query ]);

  return React.useMemo(() => ({
    query,
    searchTerm,
    debouncedSearchTerm,
    onSearchTermChange,
  }), [ query, searchTerm, debouncedSearchTerm, onSearchTermChange ]);
}
