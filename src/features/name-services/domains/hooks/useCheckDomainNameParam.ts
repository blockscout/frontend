// SPDX-License-Identifier: LicenseRef-Blockscout

import { useRouter } from 'next/router';
import React from 'react';

import useApiQuery from 'src/api/hooks/useApiQuery';

import config from 'src/config';

const DOMAIN_NAME_REGEXP = /.\../;

const feature = config.features.nameServices;

export default function useCheckDomainNameParam(hashOrDomainName: string) {
  const router = useRouter();
  const maybeDomainName = DOMAIN_NAME_REGEXP.test(hashOrDomainName);
  const isQueryEnabled = feature.isEnabled && feature.ens.isEnabled && maybeDomainName;

  const domainLookupQuery = useApiQuery('bens:domains_lookup', {
    queryParams: {
      name: hashOrDomainName,
      protocols: feature.isEnabled && feature.ens.isEnabled ? feature.ens.protocols : undefined,
      only_active: false,
    },
    queryOptions: {
      enabled: isQueryEnabled,
    },
  });

  const firstDomainAddress = domainLookupQuery.data?.items[0]?.resolved_address?.hash;

  React.useEffect(() => {
    if (firstDomainAddress) {
      router.replace({ pathname: '/address/[hash]', query: { hash: firstDomainAddress } });
    }
  }, [ firstDomainAddress, router ]);

  return isQueryEnabled && (domainLookupQuery.isPending || Boolean(firstDomainAddress));
}
