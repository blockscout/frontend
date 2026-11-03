// SPDX-License-Identifier: LicenseRef-Blockscout

import { useCallback } from 'react';

import { useRouter } from 'src/shared/router/useRouter';

export function useQueryParams() {
  const router = useRouter();

  const updateQuery = useCallback((updates: Record<string, string | undefined | Array<string>>, replace = false) => {
    const newQuery = { ...router.query };

    Object.entries(updates).forEach(([ key, value ]) => {
      if (value === undefined) {
        delete newQuery[key];
      } else {
        newQuery[key] = value;
      }
    });

    const routerFn = replace ? router.replace : router.push;
    routerFn({ pathname: router.pathname, query: newQuery }, { shallow: true });
  }, [ router ]);

  return { updateQuery };
}
