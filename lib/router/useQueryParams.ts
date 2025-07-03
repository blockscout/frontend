import { useRouter } from 'next/router';
import { useCallback } from 'react';

export function useQueryParams() {
  const router = useRouter();

  const updateQuery = useCallback((updates: Record<string, string | undefined>) => {
    const newQuery = { ...router.query };

    Object.entries(updates).forEach(([ key, value ]) => {
      if (value === undefined) {
        delete newQuery[key];
      } else {
        newQuery[key] = value;
      }
    });

    router.push({ pathname: router.pathname, query: newQuery }, undefined, { shallow: true });
  }, [ router ]);

  return { updateQuery };
}
