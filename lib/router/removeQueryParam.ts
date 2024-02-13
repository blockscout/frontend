import type { NextRouter } from 'next/router';

export default function removeQueryParam(router: NextRouter, param: string) {
  const { pathname, query } = router;
  const newQuery = { ...query };
  delete newQuery[param];
  router.replace({ pathname, query: newQuery }, undefined, { shallow: true });
}
