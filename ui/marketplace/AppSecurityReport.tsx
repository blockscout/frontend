import type { BoxProps, ButtonProps } from '@chakra-ui/react';
import { Box, Text, Flex, Separator, Icon } from '@chakra-ui/react';
import React from 'react';

import type { MarketplaceAppSecurityReport } from 'types/client/marketplace';
import { ContractListTypes } from 'types/client/marketplace';

import config from 'configs/app';
// This icon doesn't work properly when it is in the sprite
// Probably because of the gradient
// eslint-disable-next-line no-restricted-imports
import solidityScanIcon from 'icons/brands/solidity_scan.svg';
import * as mixpanel from 'lib/mixpanel/index';
import { Link } from 'toolkit/chakra/link';
import type { PopoverContentProps } from 'toolkit/chakra/popover';
import { PopoverBody, PopoverContent, PopoverRoot } from 'toolkit/chakra/popover';
import { useDisclosure } from 'toolkit/hooks/useDisclosure';
import { apos } from 'toolkit/utils/htmlEntities';
import IconSvg from 'ui/shared/IconSvg';
import SolidityscanReportButton from 'ui/shared/solidityscanReport/SolidityscanReportButton';
import SolidityscanReportDetails from 'ui/shared/solidityscanReport/SolidityscanReportDetails';
import SolidityscanReportScore from 'ui/shared/solidityscanReport/SolidityscanReportScore';

type Props = {
  id: string;
  securityReport?: MarketplaceAppSecurityReport;
  showContractList: (id: string, type: ContractListTypes) => void;
  isLoading?: boolean;
  onlyIcon?: boolean;
  source: 'Discovery view' | 'App modal' | 'App page';
  popoverPlacement?: 'bottom-start' | 'bottom-end' | 'left';
  buttonProps?: ButtonProps;
  triggerWrapperProps?: BoxProps;
  popoverContentProps?: PopoverContentProps;
};

const AppSecurityReport = ({
  id,
  securityReport,
  showContractList,
  isLoading,
  onlyIcon,
  source,
  triggerWrapperProps,
  buttonProps,
  popoverPlacement = 'bottom-start',
  popoverContentProps,
}: Props) => {

  const { open, onOpenChange } = useDisclosure();

  const handleButtonClick = React.useCallback(() => {
    mixpanel.logEvent(mixpanel.EventTypes.PAGE_WIDGET, { Type: 'Security score', Info: id, Source: source });
  }, [ id, source ]);

  const showAnalyzedContracts = React.useCallback(() => {
    mixpanel.logEvent(mixpanel.EventTypes.PAGE_WIDGET, { Type: 'Analyzed contracts', Info: id, Source: 'Security score popup' });
    showContractList(id, ContractListTypes.ANALYZED);
    onOpenChange({ open: false });
  }, [ showContractList, id, onOpenChange ]);

  const showAllContracts = React.useCallback(() => {
    mixpanel.logEvent(mixpanel.EventTypes.PAGE_WIDGET, { Type: 'Total contracts', Info: id, Source: 'Security score popup' });
    showContractList(id, ContractListTypes.ALL);
    onOpenChange({ open: false });
  }, [ showContractList, id, onOpenChange ]);

  const {
    securityScore = 0,
    solidityScanContractsNumber = 0,
    issueSeverityDistribution = {} as MarketplaceAppSecurityReport['overallInfo']['issueSeverityDistribution'],
    totalIssues = 0,
  } = securityReport?.overallInfo || {};

  if ((!securityReport || !securityScore) && !isLoading) {
    return null;
  }

  return (
    <PopoverRoot open={ open } onOpenChange={ onOpenChange } positioning={{ placement: popoverPlacement }}>
      <SolidityscanReportButton
        score={ securityScore }
        isLoading={ isLoading }
        onClick={ handleButtonClick }
        onlyIcon={ onlyIcon }
        label={ <>The security score is based on analysis<br/>of a DApp{ apos }s smart contracts.</> }
        wrapperProps={ triggerWrapperProps }
        { ...buttonProps }
      />
      <PopoverContent w={{ base: 'calc(100vw - 48px)', lg: '328px' }} mx={{ base: 3, lg: 0 }} overflowY="auto" { ...popoverContentProps }>
        <PopoverBody px="26px" py="20px" textStyle="sm">
          <Text fontWeight="500" textStyle="xs" mb={ 2 } color="text.secondary">Smart contracts info</Text>
          <Flex alignItems="center" justifyContent="space-between" py={ 1.5 }>
            <Flex alignItems="center">
              <IconSvg name="contracts/verified_many" boxSize={ 5 } color="green.500" mr={ 1 }/>
              <Text>Verified contracts</Text>
            </Flex>
            <Link textStyle="sm" fontWeight="500" onClick={ showAllContracts }>
              { securityReport?.overallInfo.verifiedNumber ?? 0 } of { securityReport?.overallInfo.totalContractsNumber ?? 0 }
            </Link>
          </Flex>
          <Separator my={ 3 }/>
          <Box mb={ 5 }>
            { solidityScanContractsNumber } smart contract{ solidityScanContractsNumber === 1 ? ' was' : 's were' } evaluated to determine
            this protocol{ apos }s overall security score on the { config.chain.name } network by { ' ' }
            <Box>
              <Icon as={ solidityScanIcon } mr={ 1 } w="23px" h="20px" display="inline-block" verticalAlign="middle"/>
              <Text fontWeight={ 600 } display="inline-block">SolidityScan</Text>
            </Box>
          </Box>
          <SolidityscanReportScore score={ securityScore } mb={ 5 }/>
          { issueSeverityDistribution && totalIssues > 0 && (
            <Box mb={ 5 }>
              <Text py="7px" color="text.secondary" textStyle="xs" fontWeight={ 500 }>Threat score & vulnerabilities</Text>
              <SolidityscanReportDetails vulnerabilities={ issueSeverityDistribution } vulnerabilitiesCount={ totalIssues }/>
            </Box>
          ) }
          <Link onClick={ showAnalyzedContracts } display="inline-flex" alignItems="center">
            Analyzed contracts
          </Link>
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
};

export default AppSecurityReport;
