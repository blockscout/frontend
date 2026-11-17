// SPDX-License-Identifier: LicenseRef-Blockscout

import type { Router } from 'src/shared/router/useRouter';

export default function updateQueryParam(router: Router, param: string, newValue: string) {
  const { pathname, query, asPath } = router;
  const newQuery = { ...query };
  newQuery[param] = newValue;

  const hashIndex = asPath.indexOf('#');
  const hash = hashIndex !== -1 ? asPath.substring(hashIndex) : '';

  router.replace({ pathname, query: newQuery, hash }, { shallow: true });
}
