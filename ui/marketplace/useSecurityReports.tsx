import { useQuery } from '@tanstack/react-query';

import config from 'configs/app';
import type { ResourceError } from 'lib/api/resources';
import useApiFetch from 'lib/hooks/useFetch';

const feature = config.features.marketplace;
const securityReportsUrl = (feature.isEnabled && feature.securityReportsUrl) || '';

export default function useSecurityReports() {
  const apiFetch = useApiFetch();

  return useQuery<unknown, ResourceError<unknown>, Array<any>>({ // eslint-disable-line @typescript-eslint/no-explicit-any
    queryKey: [ 'marketplace-security-reports' ],
    queryFn: async() => apiFetch(securityReportsUrl, undefined, { resource: 'marketplace-security-reports' }),
    placeholderData: securityReportsUrl ? [] : undefined,
    staleTime: Infinity,
    enabled: Boolean(securityReportsUrl),
  });
}
