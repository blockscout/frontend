import { Box, Text, Link, Popover, PopoverTrigger, PopoverBody, PopoverContent, useDisclosure } from '@chakra-ui/react';
import React from 'react';

import type { MarketplaceAppSecurityReport } from 'types/client/marketplace';

import config from 'configs/app';
import { apos } from 'lib/html-entities';
import * as mixpanel from 'lib/mixpanel/index';
import IconSvg from 'ui/shared/IconSvg';
import SolidityscanReportButton from 'ui/shared/solidityscanReport/SolidityscanReportButton';
import SolidityscanReportDetails from 'ui/shared/solidityscanReport/SolidityscanReportDetails';
import SolidityscanReportScore from 'ui/shared/solidityscanReport/SolidityscanReportScore';

type Props = {
  id: string;
  securityReport?: MarketplaceAppSecurityReport;
  height?: string | undefined;
  showContractList: () => void;
  isLoading?: boolean;
  onlyIcon?: boolean;
  source: 'Security view' | 'App modal' | 'App page';
}

const AppSecurityReport = ({ id, securityReport, height, showContractList, isLoading, onlyIcon, source }: Props) => {
  const { isOpen, onToggle, onClose } = useDisclosure();

  const handleButtonClick = React.useCallback(() => {
    mixpanel.logEvent(mixpanel.EventTypes.PAGE_WIDGET, { Type: 'Security score', Info: id, Source: source });
    onToggle();
  }, [ id, source, onToggle ]);

  const handleLinkClick = React.useCallback(() => {
    mixpanel.logEvent(mixpanel.EventTypes.PAGE_WIDGET, { Type: 'Analyzed contracts', Info: id, Source: 'Security score popup' });
    showContractList();
  }, [ id, showContractList ]);

  if (!securityReport && !isLoading) {
    return null;
  }

  const {
    securityScore = 0,
    solidityScanContractsNumber = 0,
    issueSeverityDistribution = {} as MarketplaceAppSecurityReport['overallInfo']['issueSeverityDistribution'],
    totalIssues = 0,
  } = securityReport?.overallInfo || {};

  return (
    <Popover isOpen={ isOpen } onClose={ onClose } placement="bottom-start" isLazy>
      <PopoverTrigger>
        <SolidityscanReportButton
          score={ securityScore }
          isLoading={ isLoading }
          onClick={ handleButtonClick }
          height={ height }
          onlyIcon={ onlyIcon }
          label="The security score is based on analysis of a DApp's smart contracts."
        />
      </PopoverTrigger>
      <PopoverContent w={{ base: '100vw', lg: '328px' }}>
        <PopoverBody px="26px" py="20px" fontSize="sm">
          <Box mb={ 5 }>
            { solidityScanContractsNumber } smart contract{ solidityScanContractsNumber === 1 ? ' was' : 's were' } evaluated to determine
            this protocol{ apos }s overall security score on the { config.chain.name } network.
          </Box>
          <SolidityscanReportScore score={ securityScore } mb={ 5 }/>
          { issueSeverityDistribution && totalIssues > 0 && (
            <Box mb={ 5 }>
              <Text py="7px" variant="secondary" fontSize="xs" fontWeight={ 500 }>Threat score & vulnerabilities</Text>
              <SolidityscanReportDetails vulnerabilities={ issueSeverityDistribution } vulnerabilitiesCount={ totalIssues }/>
            </Box>
          ) }
          <Link onClick={ handleLinkClick } display="inline-flex" alignItems="center">
            Analyzed contracts
            <IconSvg name="arrows/north-east" boxSize={ 5 } color="gray.400"/>
          </Link>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default AppSecurityReport;
