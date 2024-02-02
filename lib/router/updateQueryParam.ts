import type { NextRouter } from 'next/router';

export default function updateQueryParam(router: NextRouter, param: string, newValue: string) {
  const { pathname, query } = router;
  query[param] = newValue;
  router.replace({ pathname, query }, undefined, { shallow: true });
}
