import { Box, Text, Link } from '@chakra-ui/react';
import React from 'react';

import { ContractListTypes } from 'types/client/marketplace';

import config from 'configs/app';
import { apos } from 'lib/html-entities';
import IconSvg from 'ui/shared/IconSvg';
import SolidityscanReportButton from 'ui/shared/solidityscanReport/SolidityscanReportButton';
import SolidityscanReportDetails from 'ui/shared/solidityscanReport/SolidityscanReportDetails';
import SolidityscanReportScore from 'ui/shared/solidityscanReport/SolidityscanReportScore';

type Props = {
  id: string;
  securityReport?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  isLarge?: boolean;
  showContractList: (id: string, type: ContractListTypes) => void;
}

const AppSecurityReport = ({ id, securityReport, isLarge, showContractList }: Props) => {
  const {
    overallInfo: {
      securityScore,
      solidityScanContractsNumber,
      issueSeverityDistribution,
      totalIssues,
    },
  } = securityReport;

  const showAnalyzedContracts = React.useCallback(() => {

    showContractList(id, ContractListTypes.ANALYZED);
  }, [ showContractList, id ]);

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
          <Link onClick={ showAnalyzedContracts } display="inline-flex" alignItems="center">
            Analyzed contracts
            <IconSvg name="arrows/north-east" boxSize={ 5 } color="gray.400"/>
          </Link>
        </>
      ) }
    />
  );
};

export default AppSecurityReport;
