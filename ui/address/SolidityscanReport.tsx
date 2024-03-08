import { Box, Text, chakra } from '@chakra-ui/react';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import { SOLIDITYSCAN_REPORT } from 'stubs/contract';
import LinkExternal from 'ui/shared/LinkExternal';
import SolidityscanReportButton from 'ui/shared/solidityscanReport/SolidityscanReportButton';
import SolidityscanReportDetails from 'ui/shared/solidityscanReport/SolidityscanReportDetails';
import SolidityscanReportScore from 'ui/shared/solidityscanReport/SolidityscanReportScore';

interface Props {
  className?: string;
  hash: string;
}

const SolidityscanReport = ({ className, hash }: Props) => {
  const { data, isPlaceholderData, isError } = useApiQuery('contract_solidityscan_report', {
    pathParams: { hash },
    queryOptions: {
      enabled: Boolean(hash),
      placeholderData: SOLIDITYSCAN_REPORT,
    },
  });

  const score = Number(data?.scan_report.scan_summary.score_v2);

  if (isError || !score) {
    return null;
  }

  const vulnerabilities = data?.scan_report.scan_summary.issue_severity_distribution;
  const vulnerabilitiesCounts = vulnerabilities ? Object.values(vulnerabilities) : [];
  const vulnerabilitiesCount = vulnerabilitiesCounts.reduce((acc, val) => acc + val, 0);

  return (
    <SolidityscanReportButton
      className={ className }
      score={ score }
      isLoading={ isPlaceholderData }
      popoverContent={ (
        <>
          <Box mb={ 5 }>Contract analyzed for 140+ vulnerability patterns by SolidityScan</Box>
          <SolidityscanReportScore score={ score }/>
          { vulnerabilities && vulnerabilitiesCount > 0 && (
            <Box mb={ 5 }>
              <Text py="7px" variant="secondary" fontSize="xs" fontWeight={ 500 }>Vulnerabilities distribution</Text>
              <SolidityscanReportDetails vulnerabilities={ vulnerabilities } vulnerabilitiesCount={ vulnerabilitiesCount }/>
            </Box>
          ) }
          <LinkExternal href={ data?.scan_report.scanner_reference_url }>View full report</LinkExternal>
        </>
      ) }
    />
  );
};

export default chakra(SolidityscanReport);
