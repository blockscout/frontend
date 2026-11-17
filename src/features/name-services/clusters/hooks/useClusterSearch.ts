// SPDX-License-Identifier: LicenseRef-Blockscout

import useDebounce from 'src/shared/hooks/useDebounce';
import getQueryParamString from 'src/shared/router/get-query-param-string';
import { useRouter } from 'src/shared/router/useRouter';

export function useClusterSearch() {
  const router = useRouter();
  const searchTerm = getQueryParamString(router.query.q);
  const debouncedSearchTerm = useDebounce(searchTerm || '', 300);

  return {
    searchTerm,
    debouncedSearchTerm,
  };
}
