// SPDX-License-Identifier: LicenseRef-Blockscout

import { useRouter } from 'next/router';
import React from 'react';

import type { ExternalChainExtended } from 'src/shared/external-chains/types';

import { INTERNAL_TX } from 'src/slices/internal-tx/stubs';

import useDebounce from 'src/shared/hooks/useDebounce';
import useQueryWithPages from 'src/shared/pagination/useQueryWithPages';
import { generateListStub } from 'src/shared/pagination/utils';
import getQueryParamString from 'src/shared/router/get-query-param-string';

interface Props {
  chain?: ExternalChainExtended;
}

export default function useInternalTxsQuery({ chain }: Props = {}) {
  const router = useRouter();
  const [ searchTerm, setSearchTerm ] = React.useState(getQueryParamString(router.query.transaction_hash) || undefined);
  const debouncedSearchTerm = useDebounce(searchTerm || '', 300);

  const query = useQueryWithPages({
    resourceName: 'core:internal_txs',
    filters: { transaction_hash: debouncedSearchTerm },
    options: {
      placeholderData: generateListStub<'core:internal_txs'>(
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
          meta: {
            message: null,
            status: 1,
          },
        },
      ),
    },
    chain,
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
