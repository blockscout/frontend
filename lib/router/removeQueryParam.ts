import type { NextRouter } from 'next/router';

export default function removeQueryParam(router: NextRouter, param: string) {
  const { pathname, query } = router;
  delete router.query[param];
  router.replace({ pathname, query }, undefined, { shallow: true });
}
