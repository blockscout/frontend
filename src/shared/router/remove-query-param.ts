// SPDX-License-Identifier: LicenseRef-Blockscout

import type { Router } from 'src/shared/router/useRouter';

export default function removeQueryParam(router: Router, param: string) {
  const { pathname, query, asPath } = router;
  const newQuery = { ...query };
  delete newQuery[param];

  const hashIndex = asPath.indexOf('#');
  const hash = hashIndex !== -1 ? asPath.substring(hashIndex) : '';

  router.replace({ pathname, query: newQuery, hash }, { shallow: true });
}
