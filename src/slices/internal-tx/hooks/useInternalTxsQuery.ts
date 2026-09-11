// SPDX-License-Identifier: LicenseRef-Blockscout

import { debounce } from 'es-toolkit';
import React from 'react';

import type { ExternalChainExtended } from 'src/shared/external-chains/types';

import { INTERNAL_TX } from 'src/slices/internal-tx/stubs';

import useQueryWithPages from 'src/shared/pagination/useQueryWithPages';
import { generateListStub } from 'src/shared/pagination/utils';
import getQueryParamString from 'src/shared/router/get-query-param-string';

import { SECOND } from 'src/toolkit/utils/consts';

const SEARCH_DEBOUNCE = 0.3 * SECOND;

interface Props {
  chain?: ExternalChainExtended;
}

export default function useInternalTxsQuery({ chain }: Props = {}) {
  const query = useQueryWithPages({
    resourceName: 'core:internal_txs',
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

  const searchTerm = getQueryParamString(query.filters.transaction_hash) || undefined;

  const { onFilterChange } = query;
  const onSearchTermChange = React.useMemo(
    () => debounce((value: string) => onFilterChange({ transaction_hash: value }), SEARCH_DEBOUNCE),
    [ onFilterChange ],
  );
  React.useEffect(() => () => onSearchTermChange.cancel(), [ onSearchTermChange ]);

  return React.useMemo(() => ({
    query,
    searchTerm,
    onSearchTermChange,
  }), [ query, searchTerm, onSearchTermChange ]);
}
