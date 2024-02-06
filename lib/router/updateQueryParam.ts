import type { NextRouter } from 'next/router';

export default function updateQueryParam(router: NextRouter, param: string, newValue: string) {
  const { pathname, query } = router;
  const newQuery = { ...query };
  newQuery[param] = newValue;
  router.replace({ pathname, query: newQuery }, undefined, { shallow: true });
}
