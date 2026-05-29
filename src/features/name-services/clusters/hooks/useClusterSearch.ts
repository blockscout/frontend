// SPDX-License-Identifier: LicenseRef-Blockscout

import { useRouter } from 'next/router';

import useDebounce from 'src/shared/hooks/useDebounce';
import getQueryParamString from 'src/shared/router/get-query-param-string';

export function useClusterSearch() {
  const router = useRouter();
  const searchTerm = getQueryParamString(router.query.q);
  const debouncedSearchTerm = useDebounce(searchTerm || '', 300);

  return {
    searchTerm,
    debouncedSearchTerm,
  };
}
