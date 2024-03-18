import { useQuery } from '@tanstack/react-query';

import config from 'configs/app';
import type { ResourceError } from 'lib/api/resources';
import useApiFetch from 'lib/hooks/useFetch';

const feature = config.features.marketplace;
const securityReportsUrl = (feature.isEnabled && feature.securityReportsUrl) || '';

export default function useSecurityReports() {
  const apiFetch = useApiFetch();

  return useQuery<unknown, ResourceError<unknown>, Record<string, any>>({ // eslint-disable-line @typescript-eslint/no-explicit-any
    queryKey: [ 'marketplace-security-reports' ],
    queryFn: async() => apiFetch(securityReportsUrl, undefined, { resource: 'marketplace-security-reports' }),
    select: (data) => {
      const securityReports: Record<string, any> = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
      (data as Array<any>).forEach((item) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        const report = item.chainsData[config.chain.id || ''];
        if (report) {
          const issues: Record<string, number> = report.overallInfo.issueSeverityDistribution;
          report.overallInfo.totalIssues = Object.values(issues).reduce((acc, val) => acc + val, 0);
          report.overallInfo.securityScore = Number(report.overallInfo.securityScore.toFixed(2));
        }
        securityReports[item.appName] = report;
      });
      return securityReports;
    },
    placeholderData: securityReportsUrl ? {} : undefined,
    staleTime: Infinity,
    enabled: Boolean(securityReportsUrl),
  });
}
