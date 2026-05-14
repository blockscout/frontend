// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import useApiQuery from 'client/api/hooks/useApiQuery';

import { isBech32Address, fromBech32Address } from 'client/slices/address/utils/bech32';

import { getExternalSearchItem } from 'client/features/chain-variants/zeta-chain/utils/external-search';
import useSearchMultichain from 'client/features/multichain/hooks/useSearchMultichain';

import useDebounce from 'client/shared/hooks/useDebounce';

import config from 'configs/app';
import multichainConfig from 'configs/multichain';

export default function useQuickSearchQuery() {
  const [ searchTerm, setSearchTerm ] = React.useState('');

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const isMultichain = React.useMemo(() => {
    return Boolean(multichainConfig());
  }, []);

  const mainQuery = useApiQuery('general:quick_search', {
    queryParams: { q: isBech32Address(debouncedSearchTerm) ? fromBech32Address(debouncedSearchTerm) : debouncedSearchTerm },
    queryOptions: {
      enabled: debouncedSearchTerm.trim().length > 0 && !isMultichain,
    },
  });

  const multichainQuery = useSearchMultichain({ searchTerm: debouncedSearchTerm, enabled: isMultichain });

  const redirectCheckQuery = useApiQuery('general:search_check_redirect', {
    // on pages with regular search bar we check redirect on every search term change
    // in order to prepend its result to suggest list since this resource is much faster than regular search
    queryParams: { q: debouncedSearchTerm },
    queryOptions: { enabled: Boolean(debouncedSearchTerm) && !isMultichain },
  });

  const zetaChainCCTXQuery = useApiQuery('zetachain:transactions', {
    queryParams: {
      hash: debouncedSearchTerm,
      limit: 10,
      offset: 0,
      direction: 'DESC',
    },
    queryOptions: { enabled: debouncedSearchTerm.trim().length > 0 && config.features.zetachain.isEnabled },
  });

  const query = isMultichain ? multichainQuery : mainQuery;

  return React.useMemo(() => ({
    searchTerm,
    debouncedSearchTerm,
    handleSearchTermChange: setSearchTerm,
    query,
    redirectCheckQuery,
    externalSearchItem: getExternalSearchItem(debouncedSearchTerm),
    zetaChainCCTXQuery,
  }), [ debouncedSearchTerm, query, redirectCheckQuery, searchTerm, zetaChainCCTXQuery ]);
}
