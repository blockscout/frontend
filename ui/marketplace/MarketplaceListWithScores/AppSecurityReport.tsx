import { Box, Text } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import { apos } from 'lib/html-entities';
import LinkExternal from 'ui/shared/LinkExternal';
import SolidityscanReportButton from 'ui/shared/solidityscanReport/SolidityscanReportButton';
import SolidityscanReportDetails from 'ui/shared/solidityscanReport/SolidityscanReportDetails';
import SolidityscanReportScore from 'ui/shared/solidityscanReport/SolidityscanReportScore';

type Props = {
  securityReport?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  isLarge?: boolean;
}

const AppSecurityReport = ({ securityReport, isLarge }: Props) => {
  const {
    overallInfo: {
      securityScore,
      solidityScanContractsNumber,
      issueSeverityDistribution,
      totalIssues,
    },
  } = securityReport;

  return (
    <SolidityscanReportButton
      height={ isLarge ? undefined : '30px' }
      score={ securityScore }
      popoverContent={ (
        <>
          <Box mb={ 5 }>
            { solidityScanContractsNumber } smart contracts were evaluated to determine
            this protocol{ apos }s overall security score on the { config.chain.name } network.
          </Box>
          <SolidityscanReportScore score={ securityScore }/>
          { issueSeverityDistribution && totalIssues > 0 && (
            <Box mb={ 5 }>
              <Text py="7px" variant="secondary" fontSize="xs" fontWeight={ 500 }>Threat score & vulnerabilities</Text>
              <SolidityscanReportDetails vulnerabilities={ issueSeverityDistribution } vulnerabilitiesCount={ totalIssues }/>
            </Box>
          ) }
          <LinkExternal href="#">Analyzed contracts</LinkExternal>
        </>
      ) }
    />
  );
};

export default AppSecurityReport;
