import {
  Box,
  Flex,
  Text,
  Grid,
  Button,
  Icon,
  chakra,
  Popover,
  PopoverTrigger,
  PopoverBody,
  PopoverContent,
  useDisclosure,
  Skeleton,
  Center,
  useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';

import { SolidityscanReport } from 'types/api/contract';

import scoreNotOkIcon from 'icons/score/score-not-ok.svg';
import scoreOkIcon from 'icons/score/score-ok.svg';
import useApiQuery from 'lib/api/useApiQuery';
import { SOLIDITYSCAN_REPORT } from 'stubs/contract';
import LinkExternal from 'ui/shared/LinkExternal';

type DistributionItem = {
  id: keyof SolidityscanReport['scan_report']['scan_summary']['issue_severity_distribution'];
  name: string;
  color: string;
}

const DISTRIBUTION_ITEMS: Array<DistributionItem> = [
  { id: 'critical', name: 'Critical', color: '#891F11' },
  { id: 'high', name: 'High', color: '#EC672C' },
  { id: 'medium', name: 'Medium', color: '#FBE74D' },
  { id: 'low', name: 'Low', color: '#68C88E' },
  { id: 'informational', name: 'Informational', color: '#A3AEBE' },
  { id: 'gas', name: 'Gas', color: '#A47585' },
];

interface Props {
  className?: string;
  hash: string;
}

const SolidityscanReport = ({ className, hash }: Props) => {
  const { isOpen, onToggle, onClose } = useDisclosure();

  const { data, isPlaceholderData, isError } = useApiQuery('contract_solidityscan_report', {
    pathParams: { hash },
    queryOptions: {
      enabled: Boolean(hash),
      placeholderData: SOLIDITYSCAN_REPORT,
    },
  });

  const score = Number(data?.scan_report.scan_summary.score_v2);

  const bgBar = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');
  const chartGrayColor = useColorModeValue('gray.100', 'gray.700');
  const yetAnotherGrayColor = useColorModeValue('gray.400', 'gray.500');
  const popoverBgColor = useColorModeValue('white', 'gray.900');

  if (isError || !score) {
    return null;
  }

  let scoreColor;
  let scoreLevel;
  if (score >= 80) {
    scoreColor = 'green.600';
    scoreLevel = 'GREAT';
  } else if (score >= 30) {
    scoreColor = 'orange.600';
    scoreLevel = 'AVERAGE';
  } else {
    scoreColor = 'red.600';
    scoreLevel = 'LOW';
  }

  const vulnerabilities = data?.scan_report.scan_summary.issue_severity_distribution;
  const vulnerabilitiesCounts = vulnerabilities ? Object.values(vulnerabilities) : [];
  const vulnerabilitiesCount = vulnerabilitiesCounts.reduce((acc, val) => acc + val, 0);

  return (
    <Popover isOpen={ isOpen } onClose={ onClose } placement="bottom-start" isLazy>
      <PopoverTrigger>
        <Skeleton isLoaded={ !isPlaceholderData }>
          <Button
            className={ className }
            color={ scoreColor }
            borderColor={ scoreColor }
            size="sm"
            variant="outline"
            colorScheme="gray"
            onClick={ onToggle }
            aria-label="SolidityScan score"
            fontWeight={ 500 }
            px={ 2 }
            h="32px"
            flexShrink={ 0 }
          >
            <Icon as={ score < 80 ? scoreNotOkIcon : scoreOkIcon } boxSize={ 5 } mr={ 1 }/>
            { score }
          </Button>
        </Skeleton>
      </PopoverTrigger>
      <PopoverContent w={{ base: '100vw', lg: '328px' }}>
        <PopoverBody px="26px" py="20px" fontSize="sm">
          <Box mb={ 5 }>Contract analyzed for 140+ vulnerability patterns by SolidityScan</Box>
          <Flex alignItems="center" mb={ 5 }>
            <Box
              w={ 12 }
              h={ 12 }
              bgGradient={ `conic-gradient(${ scoreColor } 0, ${ scoreColor } ${ score }%, ${ chartGrayColor } 0, ${ chartGrayColor } 100%)` }
              borderRadius="24px"
              position="relative"
              mr={ 3 }
            >
              <Center position="absolute" w="38px" h="38px" top="5px" right="5px" bg={ popoverBgColor } borderRadius="20px">
                <Icon as={ score < 80 ? scoreNotOkIcon : scoreOkIcon } boxSize={ 5 } color={ scoreColor }/>
              </Center>
            </Box>
            <Box>
              <Flex>
                <Text color={ scoreColor } fontSize="lg" fontWeight={ 500 }>{ score }</Text>
                <Text color={ yetAnotherGrayColor } fontSize="lg" fontWeight={ 500 } whiteSpace="pre"> / 100</Text>
              </Flex>
              <Text color={ scoreColor } fontWeight={ 500 }>Security score is { scoreLevel }</Text>
            </Box>
          </Flex>
          { vulnerabilities && vulnerabilitiesCount > 0 && (
            <Box mb={ 5 }>
              <Text py="7px" variant="secondary" fontSize="xs" fontWeight={ 500 }>Vulnerabilities distribution</Text>
              <Grid templateColumns="20px 1fr 100px" alignItems="center" rowGap={ 2 }>
                { DISTRIBUTION_ITEMS.map(item => (
                  <>
                    <Box w={ 3 } h={ 3 } bg={ item.color } borderRadius="6px" mr={ 2 }></Box>
                    <Flex justifyContent="space-between" mr={ 3 }>
                      <Text>{ item.name }</Text>
                      <Text color={ vulnerabilities[item.id] > 0 ? 'text' : yetAnotherGrayColor }>{ vulnerabilities[item.id] }</Text>
                    </Flex>
                    <Box bg={ bgBar } h="10px" borderRadius="8px">
                      <Box bg={ item.color } w={ vulnerabilities[item.id] / vulnerabilitiesCount } h="10px" borderRadius="8px"/>
                    </Box>
                  </>
                )) }
              </Grid>
            </Box>
          ) }
          <LinkExternal href={ data?.scan_report.scanner_reference_url }>View full report</LinkExternal>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default chakra(SolidityscanReport);
