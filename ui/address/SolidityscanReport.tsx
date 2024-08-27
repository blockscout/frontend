import { Box, Text, Icon, PopoverTrigger, PopoverContent, PopoverBody, useDisclosure } from '@chakra-ui/react';
import React from 'react';

// This icon doesn't work properly when it is in the sprite
// Probably because of the gradient
// eslint-disable-next-line no-restricted-imports
import solidityScanIcon from 'icons/brands/solidity_scan.svg';
import useFetchReport from 'lib/solidityScan/useFetchReport';
import Popover from 'ui/shared/chakra/Popover';
import LinkExternal from 'ui/shared/links/LinkExternal';
import SolidityscanReportButton from 'ui/shared/solidityscanReport/SolidityscanReportButton';
import SolidityscanReportDetails from 'ui/shared/solidityscanReport/SolidityscanReportDetails';
import SolidityscanReportScore from 'ui/shared/solidityscanReport/SolidityscanReportScore';

interface Props {
  hash: string;
}

const SolidityscanReport = ({ hash }: Props) => {
  const { isOpen, onToggle, onClose } = useDisclosure();

  const { data, isPlaceholderData, isError } = useFetchReport({ hash });

  if (isError || !data) {
    return null;
  }

  const score = Number(data.scan_report.scan_summary.score_v2);

  if (!score) {
    return null;
  }

  const vulnerabilities = data.scan_report.scan_summary.issue_severity_distribution;
  const vulnerabilitiesCounts = vulnerabilities ? Object.values(vulnerabilities) : [];
  const vulnerabilitiesCount = vulnerabilitiesCounts.reduce((acc, val) => acc + val, 0);

  return (
    <Popover isOpen={ isOpen } onClose={ onClose } placement="bottom-start" isLazy>
      <PopoverTrigger>
        <SolidityscanReportButton
          score={ score }
          isLoading={ isPlaceholderData }
          onClick={ onToggle }
          isActive={ isOpen }
        />
      </PopoverTrigger>
      <PopoverContent w={{ base: '100vw', lg: '328px' }}>
        <PopoverBody px="26px" py="20px" fontSize="sm">
          <Box mb={ 5 } lineHeight="25px">
            Contract analyzed for 240+ vulnerability patterns by
            <Icon as={ solidityScanIcon } mr={ 1 } ml="6px" w="23px" h="20px" display="inline-block" verticalAlign="middle"/>
            <Text fontWeight={ 600 } display="inline-block">SolidityScan</Text>
          </Box>
          <SolidityscanReportScore score={ score } mb={ 5 }/>
          { vulnerabilities && vulnerabilitiesCount > 0 && (
            <Box mb={ 5 }>
              <Text py="7px" variant="secondary" fontSize="xs" fontWeight={ 500 }>Vulnerabilities distribution</Text>
              <SolidityscanReportDetails vulnerabilities={ vulnerabilities } vulnerabilitiesCount={ vulnerabilitiesCount }/>
            </Box>
          ) }
          <LinkExternal href={ data.scan_report.scanner_reference_url }>View full report</LinkExternal>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default React.memo(SolidityscanReport);
