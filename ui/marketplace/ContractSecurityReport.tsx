import { Box, Text } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import LinkExternal from 'ui/shared/LinkExternal';
import SolidityscanReportButton from 'ui/shared/solidityscanReport/SolidityscanReportButton';
import SolidityscanReportDetails from 'ui/shared/solidityscanReport/SolidityscanReportDetails';
import SolidityscanReportScore from 'ui/shared/solidityscanReport/SolidityscanReportScore';

type Props = {
  securityReport?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

const ContractSecurityReport = ({ securityReport }: Props) => {
  const {
    scanner_reference_url: url,
    scan_summary: {
      score_v2: securityScore,
      issue_severity_distribution: issueSeverityDistribution,
    },
  } = securityReport;

  const totalIssues = Object.values(issueSeverityDistribution as Record<string, number>).reduce((acc, val) => acc + val, 0);

  return (
    <SolidityscanReportButton
      score={ securityScore }
      popoverContent={ (
        <>
          <Box mb={ 5 }>
            The security score was derived from evaluating the smart contracts of a protocol on the { config.chain.name } network.
          </Box>
          <SolidityscanReportScore score={ securityScore }/>
          { issueSeverityDistribution && totalIssues > 0 && (
            <Box mb={ 5 }>
              <Text py="7px" variant="secondary" fontSize="xs" fontWeight={ 500 }>Threat score & vulnerabilities</Text>
              <SolidityscanReportDetails vulnerabilities={ issueSeverityDistribution } vulnerabilitiesCount={ totalIssues }/>
            </Box>
          ) }
          <LinkExternal href={ url }>View full report</LinkExternal>
        </>
      ) }
    />
  );
};

export default ContractSecurityReport;
