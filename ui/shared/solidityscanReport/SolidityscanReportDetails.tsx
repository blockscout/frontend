import { Box, Flex, Text, Grid, useColorModeValue, chakra } from '@chakra-ui/react';
import React from 'react';

import type { SolidityScanReportSeverityDistribution } from 'lib/solidityScan/schema';

type DistributionItem = {
  id: keyof SolidityScanReportSeverityDistribution;
  name: string;
  color: string;
};

const DISTRIBUTION_ITEMS: Array<DistributionItem> = [
  { id: 'critical', name: 'Critical', color: '#891F11' },
  { id: 'high', name: 'High', color: '#EC672C' },
  { id: 'medium', name: 'Medium', color: '#FBE74D' },
  { id: 'low', name: 'Low', color: '#68C88E' },
  { id: 'informational', name: 'Informational', color: '#A3AEBE' },
  { id: 'gas', name: 'Gas', color: '#A47585' },
];

interface Props {
  vulnerabilities: SolidityScanReportSeverityDistribution;
  vulnerabilitiesCount: number;
}

type ItemProps = {
  item: DistributionItem;
  vulnerabilities: SolidityScanReportSeverityDistribution;
  vulnerabilitiesCount: number;
};

const SolidityScanReportItem = ({ item, vulnerabilities, vulnerabilitiesCount }: ItemProps) => {
  const bgBar = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');
  const yetAnotherGrayColor = useColorModeValue('gray.400', 'gray.500');
  const vulnerability = vulnerabilities[item.id];

  if (vulnerability === undefined) {
    return null;
  }

  return (
    <>
      <Box w={ 3 } h={ 3 } bg={ item.color } borderRadius="6px" mr={ 2 }></Box>
      <Flex justifyContent="space-between" mr={ 3 }>
        <Text>{ item.name }</Text>
        <Text color={ vulnerability > 0 ? 'text' : yetAnotherGrayColor }>{ vulnerabilities[item.id] }</Text>
      </Flex>
      <Box bg={ bgBar } h="10px" borderRadius="8px">
        <Box bg={ item.color } w={ vulnerability / vulnerabilitiesCount } h="10px" borderRadius="8px"/>
      </Box>
    </>
  );
};

const SolidityscanReportDetails = ({ vulnerabilities, vulnerabilitiesCount }: Props) => {
  return (
    <Grid templateColumns="20px 1fr 100px" alignItems="center" rowGap={ 2 }>
      { DISTRIBUTION_ITEMS.map(item => (
        <SolidityScanReportItem item={ item } key={ item.id } vulnerabilities={ vulnerabilities } vulnerabilitiesCount={ vulnerabilitiesCount }/>
      )) }
    </Grid>
  );
};

export default chakra(SolidityscanReportDetails);
